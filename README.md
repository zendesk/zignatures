# Zignatures

Zignature app enhances Agents, Admins and Marketing users to control, localize and customize signatures

Available in English, German and Russian languages.

### Description

Zignatures is ticket sidebar/new ticket sidebar app which solves very old product limitation around Agent signatures.
Out of the box Zendesk signatures are very limited in terms of localization, customization and advanced logic.
Zignatures solves all these limitations allowing Admins to create intelligent signatures with any type of look and feel,
enabling Agents to see and control signatures behavior and ultimately make it possible for Marketing people to use this space more effectively.
Zignatures app solves real problem reported by customers like Dorchester or Radio Holland.
Zignatures app is completed and ready to be shipped, it is translated in several languages and uses latest Zendesk technologies like ZAF v2 and Zendesk gardens.

### App settings

* signature_template - Copy here the entire text or HTML which be be used for Agent signatures. Standard Zendesk placeholders and dynamic content is allowed.
* show_app_to_agents - If selected Agents will be able to see this app on the right hand side. App informs agents whether ticket will be signed or not.
* sign_private_comment - If selected the app will sign private comments. Otherwise, private comments will be ignored.
* agents_can_decide_on_comment_signatures - If selected Agent will be able to see an option not to sign a particular comment
* agents_can_decide_on_ticket_signatures - If selected Agent will be able to see an option not to sign all comments particular comment

### Signature template samples

#### default

```
<br>--<br><br><span  style='font-weight:bold;'>{{current_user.name}} [{{ticket.account}}]</span><br><br><span style='color:grey;font-size:14px;'><strong>tel:</strong> {{current_user. phone}}</span><br><span style='color:grey;font-size:14px;'><strong>email:</strong> {{current_user.email}}</span><br><span style='color:grey;font-size:14px;'><strong>www:</strong> <a href='https://www.zendesk.com/' target=_blank'>www.zendesk.com</a></span><br><br><img class='logo-image' src='https://d1eipm3vz40hy0.cloudfront.net/images/part-header/zendesk-relationshapes-logo.svg' width='101' height='19' alt='The Zendesk logo. Let's make things better in customer service.'><span></span>
```

![](screenshots/default_sig.png)

#### marketing

```
<br>--<br><br><div style='font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;'><span style='font-weight:bold;'>{{current_user.name}} [{{ticket.account}}]</span><br><br><span style='color:grey;font-size:14px;'><strong><img src='http://icons.iconarchive.com/icons/martz90/circle/512/phone-icon.png' height='15px' /></strong> {{current_user. phone}}</span><br><span style='color:grey;font-size:14px;'><strong><img src='https://www.medic-ce.com/assets/icon--contact-96x96@2x-07b9370b94912d8ec6fcbd3fc44677e9.png' height='15px' /></strong> {{current_user.email}}</span><br><span style='color:grey;font-size:14px;'><strong><img src='http://photos.gograph.com/thumbs/CSP/CSP990/k11028310.jpg' height='15px' /></strong> <a href='https://www.zendesk.com/' target=_blank'>www.zendesk.com</a></span><br><br><span>Joing us celebrating 100 000 live customers!</span><br><br><img class='logo-image' src='https://cdn2.hubspot.net/hubfs/528974/Marketing/Blog/2016_04_Zendesk.png' width='500' alt='Banner'><span></span></div>
```

![](screenshots/marketing_sig.png)

#### support

```
<br>--<br><br><div style='font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;'>Regards,<br><br><span  style='font-weight:bold;'>{{current_user.name}} [{{ticket.account}}]</span><br><br><span style='color:grey;font-size:14px;'><strong>tel:</strong> {{current_user. phone}}</span><br><span style='color:grey;font-size:14px;'><strong>email:</strong> {{current_user.email}}</span><br><span style='color:grey;font-size:14px;'><strong>www:</strong> <a href='https://www.zendesk.com/' target=_blank'>www.zendesk.com</a></span><br><br><span>We also have amazing knowledge base. Checking this out.<br><a href='https://support.zendesk.com/hc/' target=_blank'>https://support.zendesk.com/hc/</a></span></div>
```

![](screenshots/support_sig.png)

### App in action

![](https://cl.ly/0v3R1F0m2i1p/Screen%20Recording%202017-06-02%20at%2005.52%20PM.gif)

### Screenshots

![](screenshots/positive.png)

![](screenshots/error_1.png)

![](screenshots/error_2.png)

![](screenshots/screenshot-3.png)

![](screenshots/app_settings.png)
