(function($, client){
  'use strict';

  // const client = ZAFClient.init();
  let PARAMS = {};

  client.invoke('app.hide');
  client.on('app.registered', init);

  function init(e) {
    PARAMS = e;
    PARAMS.isSignable = true;
    PARAMS.canBeSignable = true;
    PARAMS.firstLoad = false;
    PARAMS.method = 'comment.appendHtml';
    PARAMS.noSignature = getBoolean(localStorage.getItem('noSignature'));
    getUser();
  }

  function getUser() {
    client.get('currentUser').then(function(data) {
      PARAMS.current_user = data.currentUser;
      prepTranslation();
    });
  }

  function prepTranslation() { // get translation file for current agent
      getTranslation(PARAMS.current_user.locale).then(
        function (data) { getTicket(); },
        function (data) {
          logError('Unable to get translations. Check console for more details and contact App developer', data);
          getTicket();
        }
      );
    }

  function getTicket() {
    if (PARAMS.context.location !== 'new_ticket_sidebar') {
      client.get('ticket').then(function(ticket){
        PARAMS.ticket = ticket.ticket;

        PARAMS.isSignable = (PARAMS.ticket.comment.type === 'publicReply') || (PARAMS.ticket.comment.type === 'internalNote' && PARAMS.metadata.settings.sign_private_comment);
        PARAMS.canBeSignable = (PARAMS.ticket.comment.type === 'publicReply') || (PARAMS.ticket.comment.type === 'internalNote' && PARAMS.metadata.settings.sign_private_comment);

        if (PARAMS.ticket.status === 'closed') { // never sign closed tickets
          PARAMS.canBeSignable = false;
          PARAMS.isSignable = false;
        } else {
          if (!PARAMS.isTicketSaveActive) attachTicketSaveHandler();
        }
        showApp();
      });
    } else {
      if (!PARAMS.isTicketSaveActive) attachTicketSaveHandler();
      showApp();
    }
  }

  function showApp() { // show app or keep hidden
    if (PARAMS.metadata.settings.show_app_to_agents) {
      renderAppUi();
    } else {
      PARAMS.isSignatureAllowed = PARAMS.isSignable && PARAMS.canBeSignable && (PARAMS.firstLoad || !PARAMS.noSignature);
    }
  }

  function attachTicketSaveHandler() {
    PARAMS.isTicketSaveActive = true;
    client.on('ticket.save', function() {
      return client.get('ticket.comment').then(function(comment) {
        if (isCommentSignable(comment)) {
          return client.invoke(PARAMS.method, PARAMS.metadata.settings.signature_template).then(function(result) {
            return true;
          });
        } else {
          return true;
        }
      });
    });

    client.on('comment.type.changed', function(data) {
      PARAMS.isSignable = (data === 'publicReply') || (data === 'internalNote' && PARAMS.metadata.settings.sign_private_comment);
      PARAMS.canBeSignable = (data === 'publicReply') || (data === 'internalNote' && PARAMS.metadata.settings.sign_private_comment);
      showApp();
    });

  }

  function renderAppUi() {
    let $contrainer = $('<div></div>'),
        isSignatureAllowed = PARAMS.isSignable && PARAMS.canBeSignable && (PARAMS.firstLoad || !PARAMS.noSignature),
        alert_text_yes = PARAMS.i18n.comment_will_be_signed || `<strong>This comment will be automatically signed</strong> when you press Submit button.`,
        alert_text_no = PARAMS.i18n.comment_not_be_signed || `<strong>This comment will not be signed.</strong> when you press Submit button.`,
        alert_text = isSignatureAllowed ? alert_text_yes : alert_text_no,
        alert_type = isSignatureAllowed ? 'alert-positive' : 'alert-negative',
        isCommentChecked = isSignatureAllowed ? 'checked' : '',
        isTicketChecked = PARAMS.noSignature ? '' : 'checked',
        isCommentDisabled = PARAMS.canBeSignable ? '' : 'disabled',
        cmnt_signature_text = PARAMS.i18n.sign_comment || `Sign this comment`,
        tix_signature_text = PARAMS.i18n.sign_tickets || `Sign all my comments`,
        alert = `<div class="alert ${alert_type}">${alert_text}</div>`,
        cmnt_signature = `
        <fieldset class="c-chk c-chk--toggle margin-top-10px">
          <input class="c-chk__input" id="no_comments" type="checkbox" ${isCommentChecked} ${isCommentDisabled}>
          <label class="c-chk__label u-zeta" dir="ltr" for="no_comments">${cmnt_signature_text}</label>
        </fieldset>`,
        tix_signature = `
        <fieldset class="c-chk c-chk--toggle margin-top-10px">
          <input class="c-chk__input" id="no_tickets" type="checkbox" ${isTicketChecked}>
          <label class="c-chk__label u-zeta" dir="ltr" for="no_tickets">${tix_signature_text}</label>
        </fieldset>`;

    $contrainer.append($(alert));

    if (PARAMS.metadata.settings.agents_can_decide_on_comment_signatures) $contrainer.append($(cmnt_signature));
    if (PARAMS.metadata.settings.agents_can_decide_on_ticket_signatures) $contrainer.append($(tix_signature));

    $('#zignature').html($contrainer);

    client.invoke('resize', {width: '100%',height: $('html').height() + 'px'});
    client.invoke('app.show');

    PARAMS.isSignatureAllowed = isSignatureAllowed;

    attachOptionHandlers();
  }

  function attachOptionHandlers(){
    let $cmnt = $('#no_comments'),
        $tix = $('#no_tickets');

    PARAMS.firstLoad = true;

    $cmnt.change(function() {
      PARAMS.isSignable = $(this).is(":checked");
      showApp();
    });

    $tix.change(function() {
      localStorage.setItem('noSignature', !$(this).is(':checked'));
      PARAMS.isSignable = $(this).is(':checked');
      PARAMS.noSignature = !$(this).is(':checked');
      showApp();
    });

  }

///////// HELPERS /////////

function getBoolean(string) {
  return string === 'true';
}

function isCommentSignable(comment) {
  if (!PARAMS.isSignable) return false;

  let cmnt = comment['ticket.comment'],
      isCommentPrivate = cmnt.type !== "publicReply",
      canSign = !isCommentPrivate || isCommentPrivate && PARAMS.metadata.settings.sign_private_comment,
      text = cmnt.text,
      html, hasText;

  if (cmnt.useRichText) {
    html = $.parseHTML(text);
    text = $(html).text();
    hasText = text.length > 0;
  } else {
    PARAMS.method = 'comment.appendText';
    hasText = text.length > 0;
  }

  return hasText && canSign && PARAMS.isSignatureAllowed && !isAlreadySigned(text);
}

function isAlreadySigned(text) {
  let pattern = new RegExp(escapeRegex(PARAMS.metadata.settings.signature_template),"g");
  return text.match(pattern);
}

function escapeRegex(value) {
    return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
}

function logError(msg, data){ // log error message to the console
    console.log("[" + new Date().toUTCString() + "] ERROR: " + msg);
    if (data !== undefined) console.log(data);
}

///////// LOCALISATION /////////

function getTranslation(locale) {
      return new Promise(function(resolve, reject) { // handle translation file loading
        loadTranslations(locale.replace(/-.+$/,''), resolve, reject);
      });
    }

function loadTranslations(locale, resolve, reject) { // load translation file
      $.ajax({
          url: 'translations/'+locale+'.json'
        }).done(function(data) {
          PARAMS.i18n = flatten(data);
          resolve();
        }).fail(function(e) {
          if (locale === 'en') {
            logError("Unable to load translation file. Looks like main translation file is missing", e);
            reject();
          } else { // default to English if translation is missing
            loadTranslations('en', resolve, reject);
          }
        });
    }

    function flatten(object) { // flattetning object for translations
      var flattened = {};
      Object.keys(object).forEach(function(key) {
        if (object[key] && typeof object[key] === 'object') {
          var flatObject = flatten(object[key]);
          Object.keys(flatObject).forEach(function(key2) {
            flattened[[key, key2].join('.')] = flatObject[key2];
          });
        } else {
          flattened[key] = object[key];
        }
      });
      return flattened;
    }

})(jQuery, ZAFClient.init());
