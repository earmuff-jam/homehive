import React from "react";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const handleClick = (to) => navigate(to);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>

      <Typography>
        <strong>Last Modified Date: April 17, 2026</strong>
      </Typography>

      <Typography>
        Earmuffjam LLC, (hereinafter, &quot;Homehive Solutions,&quot;
        &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides property
        management software, invoice creation, and electronic signature services
        (collectively, the &quot;Services&quot;) to landlords, property
        managers, tenants, and other users (collectively, &quot;you&quot; or
        &quot;your&quot;) through its website, https://homehivesolutions.com/
        (the &quot;Site&quot;).
      </Typography>

      <Typography>
        This privacy policy (&quot;Privacy Policy&quot;) explains the types of
        information relating to an identified or identifiable natural person, or
        as otherwise defined under applicable Privacy Laws, (&quot;Personal
        Data&quot;) that we may collect from you when you use the Services or
        interact with the Site or any affiliated third-party website that may
        contain a link to this Privacy Policy. Unless explicitly stated
        otherwise, any current, updated and new software and products, including
        the addition of new features and services shall be subject to this
        Privacy Policy, as well as our Terms of Use.
      </Typography>

      <Typography>
        If you are located in the European Economic Area (EEA), the United
        Kingdom (UK), or California or if the processing of your data is subject
        to the laws of a member state of the EEA, the UK, or to the laws of
        California, please carefully review the applicable EEA and UK Privacy
        Rights or California Privacy Rights section below for more information
        regarding your rights and our activities relating to your Personal Data.
        If the respective section is applicable to your information, then other
        sections in this Privacy Policy still may apply to you but are subject
        to (and considered modified by) that respective section.
      </Typography>

      <Typography>
        Please read this Privacy Policy carefully to understand our policies and
        practices regarding your Personal Data and how we will treat it. If you
        do not agree with our policies and practices, including our use and
        disclosure of your Personal Data, please do not use the Services and do
        not provide us with any Personal Data. However, if you choose to limit
        the information that you provide to us while using the Site and
        Services, you may not be able to use or participate in certain features
        of the Site and Services.
      </Typography>

      <Typography>
        <strong>IMPORTANT:</strong> By clicking accept to this Privacy Policy or
        registering as a member to use the Services, you agree to the terms of
        this Privacy Policy and our Terms of Use, and consent to our privacy
        practices described in this Privacy Policy, including our use and
        disclosure of your Personal Data as described below.
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          REVISIONS AND MODIFICATIONS
        </Typography>
        <Typography>
          Because our business needs may change over time, we reserve the right
          to modify this Privacy Policy. If at any time in the future we plan to
          use your Personal Data in a way that differs from this Privacy Policy,
          we will revise this Privacy Policy as appropriate. In the event of a
          material change to our Privacy Policy, we will notify you via email to
          the email address that you provided to us. The date the Privacy Policy
          was last revised is identified at the top of this webpage as the
          &quot;Last Modified Date.&quot; Subsequently consenting and using the
          Services, constitutes your agreement to and acceptance of the Privacy
          Policy and its revisions and modifications. You are responsible for
          ensuring we have an up-to-date active and deliverable email address
          for you, and for periodically visiting the Services and our Privacy
          Policy to check for any updates.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          COLLECTION OF PERSONAL DATA
        </Typography>
        <Typography>
          Homehive Solutions collects different types of Personal Data about you
          while using the Services. We collect this Personal Data in various
          ways, including:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            Directly from you when you provide it to us;
          </Typography>
          <Typography component="li">
            Automatically as you navigate through the Site; and
          </Typography>
          <Typography component="li">From third parties.</Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Personal Data Collected from You Directly
        </Typography>
        <Typography>
          Homehive Solutions may collect Personal Data directly from you when
          you use the Services. For example, when you register for an account,
          pay for the Services, or contact us. We collect the following types of
          Personal Data:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            <strong>Identifiers</strong>, including name, telephone number,
            postal address, email address, and financial and bank information
            (processed via Stripe and, in the future, Plaid);
          </Typography>
          <Typography component="li">
            <strong>Commercial Purchasing Data</strong>, including rental ledger
            data and payment history, record of applications and services
            utilized, and invoice data;
          </Typography>
          <Typography component="li">
            <strong>Employment Data</strong>, including employment status,
            income, and history (if provided by you);
          </Typography>
          <Typography component="li">
            <strong>Rental Data</strong>, such as information about your
            available rental properties, rental requirements, tenant
            information, and similar content for processing through the
            Services;
          </Typography>
          <Typography component="li">
            <strong>E-Signature Data</strong>, including documents executed
            through our electronic signature functionality and related audit
            trails;
          </Typography>
          <Typography component="li">
            <strong>Sensitive Personal Data</strong>, including financial and
            bank account information processed through Stripe and Plaid for
            payment and banking purposes. We do not collect social security
            numbers or driver&apos;s license numbers.
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Special Category Data
        </Typography>
        <Typography>
          Some of the information that we may collect as a result of providing
          the Services is sensitive (e.g., financial and bank account
          information). We only collect this information as provided by or
          consented to by you.
        </Typography>
        <Typography>
          Such sensitive information is only shared for the purpose of providing
          the Services you request or as consented for and will not be shared or
          used by us for any other purposes.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Personal Data Automatically Collected
        </Typography>
        <Typography>
          Homehive Solutions and third-party service providers may automatically
          collect information about you when you use the Site. This information
          is primarily needed to maintain the security and operation of the
          Site, prevent fraud, ensure cybersecurity, and for our internal
          analytics so that we can improve our Services and Site. This
          information includes:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            <strong>Identifiers</strong>, including IP address, cookies;
          </Typography>
          <Typography component="li">
            <strong>Internet or Other Electronic Network Activity Data</strong>,
            including (i) technical information collected in our logs (e.g.,
            your IP address, page URLs and timestamp, etc.); and (ii) device
            information such as the mobile phone provider associated with the
            device you are using to access the Services, your device&apos;s
            unique identifier, the type of device and its operating system, the
            pages or features accessed most frequently, calls and messages
            placed through the Services, how pages or features of the Services
            are used, search terms entered, and similar analytics about use of
            the Services; and
          </Typography>
          <Typography component="li">
            <strong>Location Data</strong>, we may collect, maintain, process
            and use your location data, including the real-time geographic
            location of your device (&quot;Location Data&quot;) as necessary to
            provide the Services&apos; full functionality, prevent fraud, and
            ensure cybersecurity. By using or activating any location-based
            services on your device, you agree and consent to our collection,
            maintenance, publishing, processing and use of your Location Data in
            order to provide you with the Services. We do not collect Location
            Data in a form that personally identifies you. You may withdraw your
            consent to our use of your Location Data at any time by turning off
            the location-based services on the device you are using, or by not
            using any location-based features. Turning off or not using
            location-based features may impact the functionality of the Services
            as delivered to you. Location Data provided by the Services is used
            for basic navigational and fraud prevention purposes only, and is
            not intended to be relied upon in situations where precise location
            information is needed or where erroneous, inaccurate or incomplete
            Location Data may lead to death, personal injury, property or
            environmental damage. Any use of real-time route guidance via the
            Services is at your sole risk. You understand that Location Data
            provided by the Services may not be accurate. We do not guarantee
            the availability, accuracy, completeness, reliability or timeliness
            of Location Data displayed by the Services.
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Cookies
        </Typography>
        <Typography>
          To enhance your online experience with us, the Services may presently
          or in the future use &quot;cookies.&quot; Cookies are text files that
          our web server may place on your hard disk to store your preferences.
          Cookies, by themselves, do not tell us your e-mail address or other
          PII unless you choose to provide this information to us. Once you
          choose to provide PII, however, this information may be linked to the
          data stored in a cookie. You can set your browser to notify you when
          you receive a cookie, providing you with as much control as you wish
          as to the decision to accept/reject the cookie, and deletion of the
          cookie upon leaving our Services. Please note, however, that if your
          browser does not accept cookies, you may not be able to take advantage
          of all of the features of our Services. If you would like more
          information about cookies and how to control and delete cookies in
          various browsers, such as Internet Explorer, Firefox, Safari and
          Chrome, please visit
          <Link href="https://aboutcookies.org/" target="_blank" rel="noopener">
            https://aboutcookies.org/
          </Link>
          and our Cookie Policy.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          GIFs
        </Typography>
        <Typography>
          We or our service providers may also use &quot;pixel tags,&quot;
          &quot;web beacons,&quot; &quot;clear GIFs,&quot; &quot;embedded
          links&quot; and other commonly used information-gathering tools in
          connection with some pages of the Services and HTML-formatted email
          messages. We use these tools for such purposes as compiling aggregate
          statistics about usage of the Services and response rates. A pixel tag
          is an electronic image (often a single pixel), that is ordinarily not
          visible to website visitors, and may be associated with cookies on
          visitors&apos; hard drives. Pixel tags allow us and our Service
          Providers to count users who have visited certain pages of the
          Services, to deliver customized services, and to help determine the
          effectiveness of the Services. When used in HTML-formatted email
          messages, pixel tags can inform the sender of the email whether and
          when the email has been opened.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Clickstreams
        </Typography>
        <Typography>
          As you use the Internet, you leave a trail of electronic information
          at each website you visit. This information, which is sometimes
          referred to as &quot;clickstream data&quot;, can be collected and
          stored by a website&apos;s server. Clickstream data can reveal the
          type of computer and browsing software you use and the Uniform
          Resource Locator (&quot;URL&quot;) or IP address of the website from
          which you linked to the Services. We may use clickstream data as a
          form of non-Personal Data to determine how much time visitors spend on
          each page of the Services, how visitors navigate through the Services,
          and how we may tailor our pages of the Services to better meet the
          needs of visitors. We will only use this information to improve the
          Services.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Personal Data Collected from Third Parties
        </Typography>
        <Typography>
          In addition to collecting some Personal Data directly from you, we may
          collect Personal Data from third parties including our affiliates and
          subsidiaries, data providers, and payment processors where permitted
          by law. You agree that the third-party providers of data, not Homehive
          Solutions, are responsible for maintaining your information with
          proper and sufficient accuracy and authority in accordance with all
          governing laws and regulations. We make no effort to verify any
          information for any purpose, including accuracy, legality, or
          non-infringement that we properly receive from third parties.
        </Typography>
        <Typography>
          We may also receive information about you from social media platforms,
          such as when you interact with us on those platforms or access our
          social media content. Please note that the information we may receive
          from those third-party sites (such as Facebook, Instagram, Twitter/X,
          TikTok, and YouTube) is governed by the privacy settings, policies
          and/or procedures of the applicable platform, and we strongly
          encourage you to review them before submitting any information using a
          social media platform.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          PROCESSING PURPOSES
        </Typography>
        <Typography>
          We process your Personal Data for the following lawful business and
          commercial purposes, in accordance with the practices described in
          this Privacy Policy, and based upon the legal justifications set forth
          in the parenthetical:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            <strong>Provide the Services.</strong> We may use your Personal Data
            to provide the Software, Services (including its full
            functionality), and any other products or services you may request
            from us. [CONSENT; CONTRACT; LEGITIMATE INTEREST]
          </Typography>
          <Typography component="li">
            <strong>Monitor the Services.</strong> We collect your Personal Data
            for monitoring purposes to help us diagnose problems with our
            servers, administer and troubleshoot the Services, calculate usage
            levels, analyze industry standards, and analyze transactions,
            trends, and statistics regarding the use of the Services. [CONSENT;
            LEGITIMATE INTEREST]
          </Typography>
          <Typography component="li">
            <strong>Prevent Fraud and Ensure Cybersecurity.</strong> We use your
            Personal Data, including Location Data and device information, to
            detect, prevent, and address fraudulent activity, security threats,
            and other malicious behavior. [LEGITIMATE INTEREST; LEGAL
            OBLIGATION]
          </Typography>
          <Typography component="li">
            <strong>Respond to Inquiries and Fulfill Requests.</strong> We may
            use your Personal Data to respond to your inquiries and to fulfill
            your requests for information. This may include matching prospective
            landlords and tenants with respect to rentals available. [CONSENT]
          </Typography>
          <Typography component="li">
            <strong>Create and Maintain User Account.</strong> We use your
            Personal Data to create and maintain an account for you to engage in
            property rentals, invoice creation, e-signatures, and use the
            Services we make available. [CONSENT; LEGITIMATE INTEREST]
          </Typography>
          <Typography component="li">
            <strong>Communicate with You About the Services.</strong> We may use
            your Personal Data to send you marketing information about new
            products or services and other items that may be of interest to you.
            We may also contact you on behalf of our third-party business
            partners about a particular offering of theirs that may be of
            interest to you. [CONSENT; LEGITIMATE INTEREST]
          </Typography>
          <Typography component="li">
            <strong>Improve the Services.</strong> We may use your information
            to make the Services more stable and user-friendly, to analyze
            service issues, improve the design and content of the Services,
            personalize your experience, analyze how the Services are used,
            offer new products and services, and to develop new marketing
            programs relating to the Services. [CONSENT; LEGITIMATE INTEREST]
          </Typography>
          <Typography component="li">
            <strong>Send Administrative Emails.</strong> We may use your
            Personal Data to send you email and text messages to: (a) confirm
            your account and your other Personal Data, (b) process transactions
            that you make using the Services, (c) provide you with information
            regarding the Services, or (d) inform you of changes to this Privacy
            Policy, our Terms of Use, or our other policies. [CONSENT; CONTRACT]
          </Typography>
          <Typography component="li">
            <strong>Support Business Operations.</strong> We may use your
            Personal Data to support our internal and business operations,
            including marketing, security, and advertising. [CONSENT; LEGITIMATE
            INTEREST]
          </Typography>
          <Typography component="li">
            <strong>Enforce Agreements.</strong> We may use your Personal Data
            to enforce separate agreements between you and us, enforce this
            Privacy Policy, our Terms of Use, or our third-party partner&apos;s
            Terms of Use, or in connection with a transaction with a similar
            effect. [CONSENT; CONTRACT]
          </Typography>
          <Typography component="li">
            <strong>Fulfill Other Purposes.</strong> We may use your Personal
            Data to fulfill: (a) any other purpose for which you provide it; (b)
            any legal or regulatory requirements and any of our internal
            policies; (c) other purposes disclosed at the time of collection;
            (d) any other purpose with your consent; and (e) any other purposes
            set forth in this Privacy Policy. [CONSENT; LEGITIMATE INTEREST]
          </Typography>
        </Box>
        <Typography>
          For Personal Data processed based only on your consent, you have the
          right to withdraw your consent at any time, subject to legal
          exceptions.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          DISCLOSURE OF PERSONAL DATA
        </Typography>
        <Typography>
          Except as otherwise described in this Privacy Policy, we will not
          sell, share, rent, or otherwise disclose your Personal Data that we
          collect from the Services to any third party for monetary or other
          valuable consideration, unless stated below or with your consent:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            <strong>Parent Companies, Subsidiaries, and Affiliates.</strong> We
            may disclose Personal Data about you to Earmuffjam LLC, our parent
            company, and any subsidiaries and affiliates.
          </Typography>
          <Typography component="li">
            <strong>Service Providers & Contractors.</strong> To help us provide
            superior service, your Personal Data may be shared with our service
            providers, contractors, and other third parties we use to support
            our business and who will safeguard it in accordance with this
            Privacy Policy. Such third parties may help us process payment
            information (via Stripe and, in the future, Plaid), provide identity
            verification, provide certain discounts, or provide customer
            service. These third parties are bound by contractual obligations to
            keep your Personal Data confidential and use it only for the
            purposes for which we disclose it to them. Without such information
            being made available, it would be difficult for you to purchase and
            use the Services, receive discounts from our third-party partners,
            provide us feedback to improve the Services, or access certain
            services, offers, and content on the Services.
          </Typography>
          <Typography component="li">
            <strong>Business Partners.</strong> We may share your Personal Data
            with our business partners to provide you with a product or service
            you have requested. We may also share your Personal Data to business
            partners with whom we jointly offer products, services, or programs.
          </Typography>
          <Typography component="li">
            <strong>Payment Processors.</strong> We may share your Personal Data
            with Stripe and, in the future, Plaid to process payments and
            banking transactions. Property owners are required to maintain their
            own Stripe accounts for KYC (Know Your Customer) purposes; we do not
            perform credit or background checks ourselves.
          </Typography>
          <Typography component="li">
            <strong>Advertising Partners.</strong> We may share your Personal
            Data with third party advertising partners, such as Facebook and
            Google Display Advertising and Remarketing services. These
            advertising partners may use first- and third-party cookies together
            to inform, optimize, and serve ads based on your past visits to the
            Site. You can opt out of these services using the Ads Preferences
            Manager or you can use the Google Analytics opt-out browser add-on.
            These advertising partners may use this information (and similar
            information collected from other services) for purposes of
            delivering personalized advertisements to you when you visit digital
            properties within their networks, commonly referred to as
            &quot;interest-based advertising.&quot;
          </Typography>
          <Typography component="li">
            <strong>Authorized Representatives.</strong> If another individual
            is managing your account with us which the Services connect to on
            your behalf (for example, a spouse managing the account of their
            partner), as authorized by you or as a personal representative under
            applicable law, that person can view all Personal Data about you on
            the Services.
          </Typography>
          <Typography component="li">
            <strong>
              In the Event of Merger, Sale, Divestitures, or Change of Control.
            </strong>
            Homehive Solutions reserves the right to transfer Personal Data to a
            buyer or other successor in interest that acquires rights to that
            information as a result of a merger, divestiture, restructuring,
            reorganization, dissolution, or other sale or transfer of Homehive
            Solutions or substantially all of its assets, whether as a going
            concern or as part of bankruptcy, liquidation, or similar
            proceeding, in which Personal Data held by us about you is among the
            assets transferred.
          </Typography>
          <Typography component="li">
            <strong>With Your Consent.</strong> We may share your data for other
            purposes pursuant to your consent or at your direction.
          </Typography>
          <Typography component="li">
            <strong>Other Disclosures.</strong> We may disclose your Personal
            Data if we have a good faith belief that disclosure of such
            information is helpful or reasonably necessary to: (i) conform to
            legal requirements and comply with any court order, law, or legal
            process, including responding to any government, law enforcement, or
            regulatory request; (ii) enforce the Homehive Solutions Terms and
            Conditions, terms of our business partners, or other agreements,
            including between you and us, and any other documents included or
            referenced therein (all of which are incorporated into and made a
            part of this Privacy Policy by reference); (iii) fulfill the purpose
            for which you provide it; (iv) detect, prevent, or otherwise address
            fraud or security issues; or (v) protect against harm to our, your,
            or third parties&apos; rights, property, or safety.
          </Typography>
        </Box>
        <Typography>
          Other than as set out above, you will receive notice when Personal
          Data about you might go to third parties, and you will have an
          opportunity to choose not to share the information.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          ANONYMOUS AND AGGREGATE INFORMATION
        </Typography>
        <Typography>
          We may use data capture, analysis, and similar tools to extract,
          compile, synthesize and analyze non-Personal Data collected via your
          access and use of the Services (&quot;Anonymous Data&quot;). We may
          further aggregate and combine your de-identified Anonymous Data (such
          as age, gender, the type of browser you are using, device type, the
          operating system you are using, and the domain name of your Internet
          service provider) with the Anonymous Data of others (&quot;Aggregated
          Data&quot;). To the extent that we collect any Anonymous Data or
          Aggregated Data, we shall own such Anonymous Data or Aggregated Data
          and may use it for any lawful business purpose without a duty to
          account for such use to you, provided that Anonymous Data is used only
          in an aggregated form, without specifically identifying the source of
          the Anonymous Data. Without assuming any obligations or liabilities of
          yours, we agree to use commercially reasonable efforts to comply with
          applicable laws and regulations respecting the dissemination and use
          such Anonymous Data or Aggregated Data.
        </Typography>
        <Typography>
          We may share de-identified and/or aggregate analytics with third-party
          partners about how you interact with the Site and Services, including
          usage patterns for certain programs, content, services,
          advertisements, promotions, and/or functionality available through the
          Site and Services.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          PUBLIC FORUMS
        </Typography>
        <Typography>
          You may elect to share certain Personal Data with individuals (e.g.,
          other members) or with the public via your chat rooms, profiles,
          message boards, social media, use of the Services, or any other public
          form (collectively, &quot;Public Forums&quot;). Be aware that when you
          choose to share information with friends, professionals, public
          officials, or with the public at large, you may be disclosing
          sensitive information, or information from which sensitive information
          can be inferred. Any information you provide in Public Forums shall be
          deemed to be non-confidential, and as such, you will control such
          sharing via settings that we may provide. We shall be free to
          reproduce, use, disclose, and distribute any information posted in
          Public Forums. Always use caution when sharing information through the
          Services or any Public Forums. We cannot control the actions of the
          providers or the other users of any social media platform or Public
          Forum and cannot guarantee the privacy and safety of those areas;
          therefore, we are not responsible for any content or submissions
          contained on such Public Forums. You understand and agree that we are
          not responsible for any consequences of your sharing of information
          through and beyond the Services and any Public Forums linked to or
          contained on the Services.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          THIRD PARTY WEBSITES
        </Typography>
        <Typography>
          The Services may provide links to certain third-party websites, online
          services, mobile applications and/or contain advertisement from third
          parties that are not affiliated with us and which may link to other
          website, services or applications. Please check the privacy policies
          and practices of those other third-party websites to learn how they
          collect, use, store and share information that you may submit to them
          or that they collect. We do not make any guarantee regarding those
          third-party website, services, or applications, and we are not liable
          for any loss or damage caused by the use of such websites. Any data
          collected by third parties is not covered by this Privacy Policy. This
          Privacy Policy only governs information collected on the Site or
          through the Services.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          CHOICES ABOUT YOUR PERSONAL DATA
        </Typography>

        <Typography variant="h6" gutterBottom>
          Account Profile
        </Typography>
        <Typography>
          After registering for an account within the Services, you may log-in
          to the account and edit your Personal Data in your profile.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Cookies and Similar Technologies
        </Typography>
        <Typography>
          You may stop or restrict the placement of cookies and similar
          technologies on your device or remove them by setting your browser to
          refuse all or some browser cookies, or to alert you when cookies are
          being sent. For more information, please reference the Cookie Policy.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Marketing
        </Typography>
        <Typography>
          The Services also provide you with checkboxes to &quot;opt out&quot;
          of data sharing activities or receipt of marketing communications from
          us or our affiliated third parties that you may have previously
          selected. We do not automatically add you to any marketing emails
          lists, but rather must obtain your consent via your &quot;opt in&quot;
          choices before doing so. You may have your name placed on our
          do-not-share list to specifically prohibit us from sharing your
          Personal Data with our business partners for marketing purposes. For
          instructions on how you can further access your Personal Data that we
          have collected, or how to correct errors in such information, please
          contact us as specified in the Contact Information section below.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Advertising
        </Typography>
        <Typography>
          We may use cookies and other technologies for purposes of online
          advertising. This means that when you use the Services, we or our
          advertising partners may use cookies that they collect or that we
          provide to them. Such advertising partners may collect information
          about your use of the Services or your online activities over time and
          across different websites and devices. Collected information may
          include the content you viewed, the date and time that you viewed this
          content, and the website that referred you to the Services. This
          information may be associated with your unique browser, device
          identifier or IP address. Advertising partners may provide you with
          advertisements that you may see on the Services or on affiliated
          websites. To improve the relevancy and help measure the effectiveness
          of such advertisements, they may use cookies, web beacons, clear GIFs
          or similar technologies. These practices help tailor advertisements
          that are relevant and of use to you. This Privacy Policy covers the
          use of cookies by us and does not cover the use of cookies by any
          advertisers. You may control or opt-out of such advertising by
          changing the cookie settings in your browser as described above.
        </Typography>
        <Typography>
          We and our service providers may use information about your
          interactions with the Services to predict your interests and select
          the ads you see on and off the Services. This is known as
          interest-based advertising. We may also use the information we have
          collected from you to enable us to display advertisements to our
          advertisers&apos; target audiences and to determine what Services are
          most popular. We may also collect user data to enable &quot;heat
          mapping&quot; capabilities that track the areas of a webpage where
          users most frequently move the mouse or click. These tracking
          activities make it possible to monitor and analyze web traffic and
          evaluate user behavior to customize the Services.
        </Typography>
        <Typography>
          Even though we do not disclose your Personal Data for these purposes
          without your consent, if you click on or otherwise interact with an
          advertisement, the advertiser may assume that you meet its target
          criteria. In providing interest-based ads, we follow the
          Self-Regulatory Principles for Online Behavioral Advertising developed
          by the Digital Advertising Alliance (&quot;DAA&quot;). We do not
          control third parties&apos; collection or use of your information to
          serve interest-based advertising. However, these third parties may
          provide you with ways to choose not to have your information collected
          or used in this way.
        </Typography>
        <Typography>
          For more information about interest-based advertising and how you can
          opt out, visit:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            Digital Advertising Alliance:
            <Link
              href="http://www.aboutads.info/choices"
              target="_blank"
              rel="noopener"
            >
              http://www.aboutads.info/choices
            </Link>
          </Typography>
          <Typography component="li">
            Network Advertising Initiative:
            <Link
              href="http://www.networkadvertising.org/choices/"
              target="_blank"
              rel="noopener"
            >
              http://www.networkadvertising.org/choices/
            </Link>
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Do-Not-Track
        </Typography>
        <Typography>
          Many modern web browsers give you the option to send a &quot;Do Not
          Track&quot; (&quot;DNT&quot;) signal to the websites you visit,
          indicating that you do not wish to be tracked. However, there is
          currently no uniform standard for recognizing and implementing the DNT
          signals. At this time, the Services do not monitor nor specifically
          respond to DNT requests. If a standard is adopted that we must follow
          in the future, then we will inform you about that practice in a
          revised version of this Privacy Policy.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          CONFIDENTIALITY & SECURITY
        </Typography>
        <Typography>
          After receiving your Personal Data, we will store it on our systems
          for future use. We have adequate physical, electronic, and managerial
          procedures in place to safeguard and help prevent unauthorized access,
          maintain data security, and correctly use the information we collect.
          Unfortunately, no data transmission or data storage solution can ever
          be completely secure. As a result, although we take industry-standard
          steps to protect your information (e.g., strong encryption), we cannot
          ensure or warrant the security of any information you transmit to or
          receive from us or that we store on our or our Service Providers&apos;
          systems.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          INTERNATIONAL TRANSFER OF PERSONAL DATA
        </Typography>
        <Typography>
          The Services and data we receive from other sources are hosted in the
          United States and governed by United States law. Your Personal Data
          may be transferred to, and maintained on, computers located outside of
          your state, province/territory, or country where the privacy laws may
          not be as protective as those where you live. If you are using the
          Services from outside of the United States and choose to provide your
          Personal Data to us, you understand that your Personal Data will be
          transferred and processed in the United States. As a result, this
          Personal Data may be subject to access requests from governments,
          courts, law enforcement officials and national security authorities in
          the United States according to its laws. Subject to the applicable
          laws, we will use reasonable efforts to ensure that appropriate
          protections are in place to maintain protections on the Personal Data.
          By consenting to this Privacy Policy and using the Services or
          otherwise providing information to us, you consent to the processing,
          transfer and storage of your Personal Data to the United States.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          RETENTION OF PERSONAL DATA
        </Typography>
        <Typography>
          Homehive Solutions will retain your Personal Data for as long as
          reasonably required to fulfil the purpose(s) for which it was
          collected, comply with applicable laws, and for any legitimate and
          essential business purpose. When Personal Data is no longer needed or
          legally required, it will be permanently deleted or de-identified so
          that it can no longer be associated with a specific individual. We and
          our Service Providers will also delete your account information and
          Personal Data when you delete your account. Personal Data may remain
          in backups for a reasonable period of time, or as legally required.
          Otherwise, we store your Personal Data until you request us to remove
          it from our servers. We store our logs and other technical records
          indefinitely.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          CHILDREN
        </Typography>
        <Typography>
          Homehive Solutions is not directed to children under the age of 18. We
          do not knowingly collect any information from any minors, and we
          comply with all applicable privacy laws or rules for collecting
          Personal Data from minors. The Services will not knowingly accept
          Personal Data from anyone under 18 years old in violation of
          applicable laws, without consent of a parent or guardian. In the event
          that we discover that a person under the age of 18 has provided
          Personal Data to us without parental consent, we will make efforts to
          delete the person&apos;s information. If you have concerns about this,
          wish to find out if your child has accessed the Services, or wish to
          remove your child&apos;s Personal Data from our servers, please
          contact us as specified in the Contact Information section below.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          EEA AND UK PRIVACY RIGHTS
        </Typography>
        <Typography>
          Individuals (&quot;Data Subjects&quot;) in the European Economic Area
          (&quot;EEA&quot;) and the United Kingdom (&quot;UK&quot;), have
          certain privacy rights under EEA and UK law, including the General
          Data Protection Regulations (the &quot;GDPR&quot;) and the UK Data
          Protection Act 2018.
        </Typography>
        <Typography>
          In the event we collect Personal Data (as defined in the GDPR) that is
          subject to the GDPR, this section shall apply. Terms in this section
          are to be understood in a manner consistent with the GDPR including
          the definitions of such terms in the GDPR. Such terms may have a
          different definition or meaning in other portions of this Privacy
          Policy because the GDPR may not apply to those sections.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Data Controller
        </Typography>
        <Typography>Earmuffjam LLC is the Data Controller.</Typography>

        <Typography variant="h6" gutterBottom>
          Processing Purposes and Legal Bases
        </Typography>
        <Typography>
          Homehive Solutions processes your Personal Data for the lawful
          purposes, and under the legal basis, set forth in the Processing
          Purposes section above.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Onward Transfer
        </Typography>
        <Typography>
          Homehive Solutions will not disclose Personal Data to a third party
          except as stated below:
        </Typography>
        <Typography>
          We may disclose Personal Data to subcontractors and third-party
          agents. Before disclosing Personal Data to a subcontractor or
          third-party agent, we will obtain assurances by contractual agreement
          from the recipient that it will: (i) transfer such data only for
          limited and specified purposes; (ii) ascertain that the subcontractor
          or third-party agent is obligated to provide at least the same level
          of privacy protection as is required by the GDPR; (iii) take
          reasonable and appropriate steps to ensure that subcontractors and
          third-party agents effectively process the Personal Data transferred
          in a manner consistent with the organization&apos;s obligations under
          the GDPR; (iv) require subcontractors and third-party agents to notify
          the organization if it makes a determination that it can no longer
          meet its obligation to provide the same level of protection as is
          required by the GDPR; (v) upon notice, including under (iv), take
          reasonable and appropriate steps to stop and remediate unauthorized
          processing; and (vi) provide a summary or a representative copy of the
          relevant privacy provisions of its contract with subcontractors and
          third-party agents to the Supervisory Authorities upon request.
        </Typography>
        <Typography>
          We also may be required to disclose, and may disclose, Personal Data
          in response to lawful requests by public authorities, including for
          the purpose of meeting national security or law enforcement
          requirements, or in the event of a merger or acquisition.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Rights under the GDPR
        </Typography>
        <Typography>
          Data Subjects have the following privacy rights under the GDPR:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            <strong>Right of Access.</strong> You have the right to obtain
            confirmation from us as to whether or not we process Personal Data
            from you, and you also have the right to at any time obtain access
            to your Personal Data stored by us.
          </Typography>
          <Typography component="li">
            <strong>Right to Rectification.</strong> If we process your Personal
            Data, we use reasonable measures to ensure that your Personal Data
            is accurate and up-to-date for the purposes for which your Personal
            Data was collected. If your Personal Data is inaccurate or
            incomplete, you have the right to require us to correct it.
          </Typography>
          <Typography component="li">
            <strong>Right to Erasure.</strong> You may have the right to require
            us to delete your Personal Data.
          </Typography>
          <Typography component="li">
            <strong>Right to Restrict Processing.</strong> You may have the
            right to request the restriction or suppression of Personal Data.
          </Typography>
          <Typography component="li">
            <strong>Right to Withdraw Consent.</strong> If you have given your
            consent to the processing of your Personal Data, you have the right
            to withdraw your consent at any time, without affecting the
            lawfulness of processing based on the consent before the withdrawal.
          </Typography>
          <Typography component="li">
            <strong>Right to Data Portability.</strong> You may have the right
            to receive the Personal Data concerning you and which you have
            provided to us, in a structured, commonly used and machine-readable
            format or to transmit this data to another controller.
          </Typography>
          <Typography component="li">
            <strong>Right to Object.</strong> You may have the right to object
            to the processing of your Personal Data as further specified in this
            Privacy Policy and you may have the right to object to decisions
            being made with your Personal Data based solely on automated
            decision making or profiling.
          </Typography>
          <Typography component="li">
            <strong>
              Right to Lodge a Complaint with Supervisory Authority.
            </strong>{" "}
            You have the right to lodge a complaint with a data protection
            supervisory authority located in the European Union or UK. Further
            information about how to contact your local data protection
            authority is available at the website of the European Commission.
          </Typography>
        </Box>
        <Typography>
          If you would like to exercise your EEA and UK privacy rights, please
          contact us as specified in the Contact Information section with a
          reference to &quot;EEA and UK.&quot;
        </Typography>

        <Typography variant="h6" gutterBottom>
          Choices under the GDPR
        </Typography>
        <Typography>
          Data Subjects have the right to opt out of (i) disclosures of their
          Personal Data to third parties not identified at the time of
          collection or subsequently authorized, and (ii) uses of Personal Data
          for purposes materially different from those disclosed at the time of
          collection or subsequently authorized. Data Subjects who wish to limit
          the use or disclosure of their Personal Data should submit that
          request to our Data Protection Officer. We will cooperate with Data
          Subjects&apos; instructions regarding Data Subjects&apos; choices.
        </Typography>
        <Typography>
          All of our general emails also contain an unsubscribe link at the
          bottom and you can unsubscribe to such emails at any time by clicking
          on that link.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Retention of Personal Data
        </Typography>
        <Typography>
          For more information, please refer to the Retention of Personal Data
          section above.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Typography>
          For more information, please refer to the Confidentiality & Security
          section above.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Transfer to the United States
        </Typography>
        <Typography>
          In using the Services, your Personal Data will be transferred to the
          United States. Homehive Solutions relies on your consent or Article 49
          of the GDPR for transfers of data collected from Data Subjects in the
          EEA and UK. Transfers are made to Homehive Solutions only if the Data
          Subject has explicitly consented to the proposed transfer after having
          been informed of the possible risks of such transfers. Additionally,
          we transfer data as necessary for the performance of a contract
          between you as the Data Subject and Homehive Solutions as the
          Controller, to data processors who have an agreement with us that
          includes protecting your privacy and the security of your data, and in
          cases where your Personal Data is necessary for the implementation of
          pre-contractual measures taken in accordance with your requests.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          CALIFORNIA PRIVACY RIGHTS
        </Typography>
        <Typography>
          This section explains how we collect, use, and disclose Personal Data
          about users, customers, and visitors who reside in California
          (&quot;consumers&quot; or &quot;you&quot;). It also explains certain
          rights afforded to consumers under California&apos;s Shine the Light
          law and the California Consumer Privacy Act of 2018
          (&quot;CCPA&quot;), as revised and updated by the California Privacy
          Rights Act (&quot;CPRA&quot;). This section uses certain terms that
          have the meaning given to them in the CCPA including Personal Data.
          &quot;Personal Data&quot; for purposes of this Privacy Policy has the
          same meaning as &quot;Personal Information&quot; by applicable
          California laws.
        </Typography>
        <Typography>
          The following section does not apply to individuals who do not live in
          California on a permanent basis, individuals who do not collect
          Personal Data about, or individuals for whom all of the information we
          collect is exempt from California laws.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Categories of Personal Data Collected
        </Typography>
        <Typography>
          We may collect (and have collected during the 12-month period prior to
          the &quot;Last Modified&quot; date of this Privacy Policy) the above
          categories of Personal Data about you in the Collection of Personal
          Data section above.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Purpose of Collection
        </Typography>
        <Typography>
          We may use (and may have used during the 12-month period prior to the
          &quot;Last Modified&quot; date of this Privacy Policy) your Personal
          Data for the business or commercial purposes described in the
          Processing Purposes section above.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Sources of Personal Data
        </Typography>
        <Typography>
          During the 12-month period prior to the &quot;Last Modified Date&quot;
          of this Privacy Policy, we may obtain (and may have obtained) Personal
          Data about you from the sources identified in the Collection of
          Personal Data section above.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Selling and Sharing Personal Data
        </Typography>
        <Typography>
          We do not sell or share your Personal Data in exchange for monetary
          consideration. However, the definitions of Personal Data,
          &apos;share,&apos; and &apos;sale&apos; under CCPA are broad.
        </Typography>
        <Typography>
          During the 12-month period prior to the &quot;Last Modified Date&quot;
          of this Privacy Policy, we may have shared or disclosed the following
          categories of Personal Data about you for a business or commercial
          purpose with certain categories of third parties, as described below:
        </Typography>

        <TableContainer component={Paper} sx={{ my: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Categories of Personal Data</strong>
                </TableCell>
                <TableCell>
                  <strong>Categories of Third Parties</strong>
                </TableCell>
                <TableCell>
                  <strong>Business or Commercial Purpose</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Identifiers</TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Regulatory Agencies; Business
                  Partners; Advertising Partners; Referrals
                </TableCell>
                <TableCell>
                  Provide the Services; Communicate with You About the Services;
                  Monitor the Services; Create and Maintain User Account;
                  Respond to Inquiries and Fulfill Requests; Improve the
                  Services; Enforce Agreements; Support Business Operations;
                  Fulfill Other Purposes; Prevent Fraud and Ensure Cybersecurity
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Personal Data Categories Listed in The California Customer
                  Records Statute (Cal. Civ. Code §1798.80(e))
                </TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Payment Processors; Business
                  Partners; Advertising Partners
                </TableCell>
                <TableCell>
                  Provide the Services; Communicate with You About the Services;
                  Monitor the Services; Create and Maintain User Account;
                  Respond to Inquiries and Fulfill Requests; Improve the
                  Services; Enforce Agreements; Support Business Operations;
                  Fulfill Other Purposes; Prevent Fraud and Ensure Cybersecurity
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Commercial Purchase Data</TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Business Partners; Advertising
                  Partners
                </TableCell>
                <TableCell>
                  Provide the Services; Monitor the Services; Improve the
                  Services; Communicate with You About the Services; Support
                  Business Operations
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Internet or Other Electronic Network Activity Data
                </TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Business Partners; Advertising
                  Partners
                </TableCell>
                <TableCell>
                  Provide the Services; Monitor the Services; Improve the
                  Services; Support Business Operations; Fulfill Other Purposes;
                  Prevent Fraud and Ensure Cybersecurity
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Location Data</TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Business Partners; Advertising
                  Partners
                </TableCell>
                <TableCell>
                  Provide the Services; Monitor the Services; Improve the
                  Services; Support Business Operations; Fulfill Other Purposes;
                  Prevent Fraud and Ensure Cybersecurity
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rental Data</TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Business Partners
                </TableCell>
                <TableCell>
                  Provide the Services; Monitor the Services; Improve the
                  Services; Communicate with You About the Services; Support
                  Business Operations; Support our internal and business
                  operations
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Employment Data</TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Business Partners
                </TableCell>
                <TableCell>
                  Provide the Services; Communicate with You About the Services;
                  Monitor the Services; Create and Maintain User Account;
                  Respond to Inquiries and Fulfill Requests; Improve the
                  Services; Enforce Agreements; Support Business Operations;
                  Fulfill Other Purposes
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sensitive Personal Data</TableCell>
                <TableCell>
                  Parent Companies, Subsidiaries, and Affiliates; Service
                  Providers and Contractors; Payment Processors; Business
                  Partners
                </TableCell>
                <TableCell>
                  Provide the Services; Communicate with You About the Services;
                  Monitor the Services; Create and Maintain User Account;
                  Respond to Inquiries and Fulfill Requests; Improve the
                  Services; Enforce Agreements; Support Business Operations;
                  Fulfill Other Purposes; Prevent Fraud and Ensure Cybersecurity
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom>
          California Consumer Privacy Rights
        </Typography>
        <Typography>
          Under California&apos;s &quot;Shine the Light&quot; law, California
          residents have the right to request in writing from businesses with
          whom they have an established business relationship, (a) a list of the
          categories of Personal Data, such as name, e-mail and mailing address
          and the type of services provided to the customer, that a business has
          disclosed to third parties (including affiliates that are separate
          legal entities) during the immediately preceding calendar year for the
          third parties&apos; direct marketing purposes; and (b) the names and
          addresses of all such third parties. To request the above information,
          please contact us as directed in the Contact Information section below
          with a reference to California Disclosure Information.
        </Typography>
        <Typography>
          Under CCPA, consumers have certain rights regarding their Personal
          Data, as described below.
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            <strong>Right of Access:</strong> You have the right to request,
            twice in a 12-month period, that we disclose to you the following
            information about you, limited to the preceding twelve (12) months:
            The categories of Personal Data that we collected about you; The
            categories of sources from which the Personal Data is collected; The
            business or commercial purpose for collecting or selling Personal
            Data; The categories of third parties with whom we share Personal
            Data; The specific pieces of Personal Data that we have collected
            about you; The categories of Personal Data that we disclosed about
            you for a business purpose or sold to third-parties; and For each
            category of Personal Data identified, the categories of third
            parties to whom the information was disclosed or sold.
          </Typography>
          <Typography component="li">
            <strong>Right of Deletion:</strong> You have the right to request
            that we delete any Personal Data about you which we have collected
            from you, subject to exceptions within the law.
          </Typography>
          <Typography component="li">
            <strong>Right to Opt-Out:</strong> You have the right to opt-out of
            the disclosure of Personal Data about you for monetary or other
            valuable consideration. However, we do not sell any Personal Data.
          </Typography>
          <Typography component="li">
            <strong>Right to Opt-In:</strong> We do not have actual knowledge
            that we collect, share, or sell the Personal Data of minors under
            the age of 18.
          </Typography>
          <Typography component="li">
            <strong>
              Right to Limit Use and Disclosure of Sensitive Personal Data:
            </strong>
            You may request specific limitations on further sharing, use, or
            disclosure of your Sensitive Personal Data that is collected or
            processed for &quot;the purpose of inferring characteristics about a
            consumer.&quot; However, we do not collect or process Sensitive
            Personal Data for this purpose.
          </Typography>
          <Typography component="li">
            <strong>Right to Correction:</strong> You have the right to request
            that we maintain accurate Personal Data about you and correct any
            Personal Data about you which we have collected from you, subject to
            exceptions within the law.
          </Typography>
        </Box>
        <Typography>
          If you would like to exercise your California privacy rights, please
          refer to the Consumer Requests and Verification section below.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          CONSUMER REQUESTS AND VERIFICATION
        </Typography>

        <Typography variant="h6" gutterBottom>
          Right to Non-Discrimination
        </Typography>
        <Typography>
          We may not discriminate against you because you exercise any of your
          rights under CCPA, including, but not limited to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            Denying goods or services to you;
          </Typography>
          <Typography component="li">
            Charging different prices or rates for goods or services, including
            through the use of discounts or other benefits or imposing
            penalties;
          </Typography>
          <Typography component="li">
            Providing a different level or quality of goods or services to you;
            or
          </Typography>
          <Typography component="li">
            Suggesting that you will receive a different price or rate for goods
            or services or a different level or quality of goods or services.
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Verifying Requests
        </Typography>
        <Typography>
          You may request to exercise your California privacy rights or EEA and
          UK privacy rights by contacting us as described in the Contact
          Information section below. To help protect your privacy and maintain
          security, we will take steps to verify your identity before processing
          your request. If you request access to or deletion of your Personal
          Data, we may require you to provide any of the following information:
          name, date of birth, email address, telephone number, or postal
          address. When you make such a request, you can expect the following:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            As required under applicable law, we will verify your identity. You
            will need to provide us with your email address and full name. We
            may ask for additional information if needed.
          </Typography>
          <Typography component="li">
            We will confirm that you want your information accessed, corrected,
            and/or deleted.
          </Typography>
          <Typography component="li">
            We will confirm our receipt of your request within 10 days. If you
            have not received a response within a few days after that, please
            let us know by contacting us at the webpage or phone number listed
            below.
          </Typography>
          <Typography component="li">
            We will respond to your request within 45 days upon receipt of your
            request. If necessary, we may need an additional period of time, up
            to another 45 days, but we will reply either way within the first
            45-day period and, if we need an extension, we will explain why.
          </Typography>
          <Typography component="li">
            In certain cases, a request for access, correction, or deletion may
            be denied. For example, if we cannot verify your identity, the law
            requires that we maintain the information, or if we need the
            information for internal purposes such as providing Services or
            completing an order. If we deny your request, we will explain why we
            denied it and delete any other information that is not protected and
            subject to denial.
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Authorized Agents
        </Typography>
        <Typography>
          You may designate an authorized agent to request any of the above
          rights on your behalf. You may make such a designation by providing
          the agent with written permission, signed by you, to act on your
          behalf. Your agent may contact us as described in the Contact
          Information section below to make a request on your behalf. Even if
          you choose to use an agent, we may, as permitted by law, require:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">
            The authorized agent to provide proof that you provided signed
            permission to the authorized agent to submit the request;
          </Typography>
          <Typography component="li">
            You to verify your identity directly with us; or
          </Typography>
          <Typography component="li">
            You to directly confirm with us that you provided the authorized
            agent permission to submit the request.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          CONTACT INFORMATION
        </Typography>
        <Typography>
          If you have any questions or concerns about this Privacy Policy or our
          privacy practices, or would like to submit a consumer request please
          contact us using any of the below methods:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li">CCPA Request Form</Typography>
          <Typography component="li">
            <Link href="mailto:team@homehivesolutions.com">
              team@homehivesolutions.com
            </Link>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography align="center">
        Copyright © Earmuffjam LLC. All rights reserved.
      </Typography>
      <Typography align="center">
        The Services are protected by United States and international copyright,
        trademark, and other applicable laws.
      </Typography>

      <Box sx={{ my: 4, textAlign: "center" }}>
        <Box
          component={Button}
          variant="outlined"
          marginBottom="2rem"
          onClick={() => handleClick("/contact?subject=no_sp")}
        >
          Do Not Sell My Personal Information
        </Box>
        <Typography>
          <strong>Homehive Solutions</strong>
        </Typography>
        <Typography>
          Contact Us:&nbsp;
          <Link href="mailto:team@homehivesolutions.com">
            team@homehivesolutions.com
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
