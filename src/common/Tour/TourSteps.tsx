import { ReactNode } from "react";

import { Box, Typography } from "@mui/material";
import {
  EditInvoiceRouteUri,
  InvoiceAppFaqRouteUri,
  InvoiceDashboardRouteUri,
  MainInvoiceAppRouteUri,
  MainRentAppRouteUri,
  PropertiesRouteUri,
  PropertyRouteUri,
  RecieverInforamtionRouteUri,
  RentAppFaqRouteUri,
  RentalRouteUri,
  SenderInforamtionRouteUri,
  SettingsRouteUri,
  ViewInvoiceRouteUri,
  createHelperSentences,
} from "common/utils";

type InvoiceRouteUri =
  | typeof ViewInvoiceRouteUri
  | typeof EditInvoiceRouteUri
  | typeof SenderInforamtionRouteUri
  | typeof RecieverInforamtionRouteUri
  | typeof InvoiceDashboardRouteUri
  | typeof SettingsRouteUri
  | typeof RentalRouteUri
  | typeof PropertyRouteUri
  | typeof PropertiesRouteUri;

/**
 * The type `TourElementStep` represents a step in a tour with a specified element.
 * @property {string} element - The `element` property in the `TourElementStep` type represents the
 * element that is part of a tour step. It could be a string value describing the element, such as a
 * selector or identifier for an element on a webpage.
 */
type TourElementStep = {
  element: string;
};

/**
 * The type `TourStepRange` defines a range of tour steps with corresponding elements and start/end
 * indices.
 * @property {ReactNode} element - The `element` property in the `TourStepRange` type represents a
 * ReactNode, which is a generic type for a React element, such as a component, fragment, or string. It
 * is used to define the element that will be displayed as part of a tour step.
 * @property {number} start - The `start` property in the `TourStepRange` type represents the starting
 * index of a range. It indicates the beginning point of a sequence or interval.
 * @property {number} end - The `end` property in the `TourStepRange` type represents the ending point
 * of a range. It specifies the index or position where the range ends.
 */
type TourStepRange = {
  element: ReactNode;
  start: number;
  end: number;
};

/**
 * The type `GeneratedTourSteps` defines the structure of objects representing steps in a guided tour,
 * including an id, selector, and content.
 * @property {number} id - The `id` property in the `GeneratedTourSteps` type represents a unique
 * identifier for each step in a generated tour. It is of type `number`.
 * @property {string} selector - The `selector` property in the `GeneratedTourSteps` type is a string
 * that represents a CSS selector. This selector is used to target a specific element in the DOM
 * (Document Object Model) that the tour step should be associated with.
 * @property {ReactNode} content - The `content` property in the `GeneratedTourSteps` type represents
 * the content that will be displayed at each step of a generated tour. It is of type `ReactNode`,
 * which means it can accept any valid React node, such as text, components, or elements. This allows
 * for flexibility in
 */
type GeneratedTourSteps = {
  id: number;
  selector: string;
  content: ReactNode;
};

/**
 * ViewPdfHelpSteps
 *
 * User helpful steps in the view pdf page.
 */
const ViewPdfHelpSteps: TourElementStep[] = [
  {
    element:
      "View created pdf from here. If you do not have any pdf to print, navigate to 'Edit Invoice' to create new invoices.",
  },
  {
    element:
      "Use options to help navigate or perform certain actions on specific pages. Such as Sending Email, Printing etc.",
  },
];

/**
 * EditPdfHelpSteps
 *
 * User helpful steps in the edit invoice / pdf page. This is where the users can create new invoices or update existing invoices.
 */
const EditPdfHelpSteps: TourElementStep[] = [
  {
    element:
      "Create or update a selected invoice. Invoices created are temporarily stored in the device so users can retrieve it easily.",
  },
  {
    element:
      "Fill in the element of the invoice. Sample: Rent for the month of January. ",
  },
  {
    element:
      "Invoice captions are more like a sub heading. Emphasize on what you expect. Sample: Invoice Due every 3rd of month",
  },
  {
    element:
      "Add additional notes that would be added beneath the Invoice. This is similar to footnote. Sample: No Additional payment due at this time.",
  },
  {
    element: "Select the start date and the end date for the selected invoice.",
  },
  {
    element:
      "Invoice Header is the small section on top of the invoice. This is used to give emphasis to the invoice. Sample: Rent Details.",
  },
  {
    element:
      "Add the standard tax rate. If you are unsure leave it at 0. Keep in mind that this does not include tax during calculations.",
  },
  {
    element:
      "Select the status of the invoice. This watermark will transpond on the actual paper. Choose between various options of your invoice.",
  },
  {
    element:
      "Add Item as a line item in the invoice. Each line item is customized and includes its own element and caption to allow users to provide more information.",
  },
  {
    element:
      "After meeting the requirements and adding sufficient line items to your liking, press 'Save' button. Navigate to 'View Invoice' to view the look and feel of your invoice.",
  },
];

/**
 * SenderInfoHelpSteps
 *
 * User helpful steps in the sender info page. This is where you can upload information about the sender of the invoice. Leaving this empty
 * should render no salutation in the view page.
 */
const SenderInfoHelpSteps: TourElementStep[] = [
  {
    element:
      "Sender biographic information. Store details for selected sender. Sender is the person who is requesting to send the invoice.",
  },
];

/**
 * RecieverInfoHelpSteps
 *
 * User helpful steps in the reciever info page. This is where you can upload information about the reciever of the invoice. Leaving this
 * empty should render no salutation in the view page.
 */
const RecieverInfoHelpSteps: TourElementStep[] = [
  {
    element:
      "Reciever biographic information. Store details for selected reciever. Reciever is the person who will be recieving this invoice.",
  },
];

/**
 * DashboardHelpSteps
 *
 * User helpful steps in the dashboard page. This is where users can view a breakdown of how their invoice performed with a help of couple
 * of widgets.
 */
const DashboardHelpSteps: TourElementStep[] = [
  {
    element:
      "Welcome to your local dashboard view. Your most recent invoice data characteristics are displayed here. This is your standard layout. Press the 'Edit' button to edit or remove a selected widget.",
  },
  {
    element:
      "Select '+' to add widgets in the dashboard. You can add multiple of the same widgets as well.",
  },
  {
    element: "Reset your dashboard to remove clutter.",
  },
  {
    element:
      "View your added invoices here. If you do not have widgets, add widgets and restart the tutorial to proceed.",
  },
  {
    element:
      "This is the Invoice Timeline Chart Widget. This displays the posted payment and timeline of the posted payment.",
  },
  {
    element:
      "This is the Collected Tax and Totals Widget. This displays the monetary amount collected and taxes collected. View timeline chart if many invoices are selected.",
  },
  {
    element:
      "This is the Items and Service Type Widget. This displays the type of item the invoice was created for.",
  },
  {
    element:
      "This is the Item Details Table. We can view details about the imported invoices in the list form. If you have many invoices, you can view them in a list form.",
  },
];

/**
 * MyPropertiesListHelpSteps
 *
 * User helpful steps for the properties list page.
 */
const MyPropertiesListHelpSteps: TourElementStep[] = [
  {
    element:
      "View a list of properties that are managed / owned by you. If you don't have a property 'Add Property' to begin.",
  },
  {
    element: "Create a new property via this 'Add Property' button.",
  },
  {
    element: "Remove a property with a simple click of this delete button.",
  },
  {
    element:
      "View a quick overview of tenant details if you have them. If you do not have tenant details associate tenants before proceeding.",
  },
  {
    element:
      "View current rent payment status and the next payment due date. Use Quick Connect to quickly send invoices, reminders or even lease renewal templates. Do not like what you see? Navigate to settings -> templates to change the default template.",
  },
  {
    element: "Click on this property to dive deeper into that property.",
  },
];

/**
 * MyPropertyHelpSteps
 *
 * User helpful steps for viewing a single property page.
 */
const MyPropertyHelpSteps: TourElementStep[] = [
  {
    element: "View more details about your property.",
  },
  {
    element:
      "View brief overview of your home including address, total available rental bedrooms, occupancy rate and monthly rental amount including additional charges",
  },
  {
    element: "View a financial projection of your home.",
  },
  {
    element:
      "View details about the property owner. You can email the property owner directly if you are a tenant.",
  },
  {
    element: "View property details and the state it was last updated in.",
  },
  {
    element: "Perform quick actions against your property such as Editing it.",
  },
  {
    element:
      "View all documents that are available between the tenant and the owner.",
  },
  {
    element: "View all payment summaries made the tenant for this property.",
  },
  {
    element: "View a list of all the active tenants for this property.",
  },
];

/**
 * SettingsHelpSteps
 *
 * User helpful steps for viewing user settings
 */
const SettingsHelpSteps: TourElementStep[] = [
  {
    element: "View your account related information here.",
  },
  {
    element: "View or edit your biographic information here.",
  },
  {
    element:
      "Navigate to templates, and view all associated templates here. You can customize templates to your liking here. You can even use html if you would like. Please note that using incorrect values will not display the html correctly.",
  },
  {
    element:
      "Connect with our 3rd party entities for a smoother rental experience. Use 'Stripe' for account management and custom Esign for document signing. Property owners must go through user verification for KYC Compliance in Stripe. Esign users are verified via their google account.",
  },
];

/**
 * RentalHelpSteps
 *
 * User helpful steps for viewing rental page
 */
const RentalHelpSteps: TourElementStep[] = [
  {
    element: "View more details about the current property you rent.",
  },
  {
    element:
      "View brief overview of your rental home including address, total available rental bedrooms, occupancy rate and monthly rental amount including additional charges",
  },
  {
    element: "View a financial projection of your rental home.",
  },
  {
    element:
      "View details about the property owner. You can email the property owner directly if you are a tenant.",
  },
  {
    element: "View property details and the state it was last updated in.",
  },
  {
    element:
      "Perform quick actions against your rental property such as requesting for maintenance. (Feature TBD)",
  },
  {
    element:
      "View all documents that are available between you and the property owner.",
  },
  {
    element: "View all payment summaries made by you",
  },
];

const derieveTourSteps = (
  staticSteps: TourElementStep[],
  prefix: string,
): GeneratedTourSteps[] => {
  return staticSteps.map(({ element }, index) => ({
    id: index,
    selector: `[data-tour="${prefix}-${index}"]`,
    content: (
      <Typography
        variant="subtitle2"
        sx={{ padding: "0.2rem" }}
        padding="0.2rem"
      >
        {element}
      </Typography>
    ),
  }));
};

const DisplaySubHelperSection = () => {
  const handleClick = (to: string = "") => {
    if (to) {
      window.location.href = to;
      return;
    } else {
      const existingLocation = window.location.href;
      if (existingLocation.includes(MainRentAppRouteUri)) {
        window.location.href = RentAppFaqRouteUri;
        return;
      } else if (existingLocation.includes(MainInvoiceAppRouteUri)) {
        window.location.href = InvoiceAppFaqRouteUri;
        return;
      } else {
        return;
      }
    }
  };

  return (
    <Typography variant="caption">
      &nbsp;View&nbsp;
      <Box
        component="span"
        onClick={() => handleClick("/notes")}
        sx={{
          color: "primary.main",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        role="link"
        tabIndex={0}
      >
        Release Notes&nbsp;
      </Box>
      to stay up to date with all the latest features. Stuck in a problem?
      Visit&nbsp;
      <Box
        component="span"
        onClick={() => handleClick()}
        sx={{
          color: "primary.main",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        role="link"
        tabIndex={0}
      >
        FAQ&nbsp;
      </Box>
      to view our frequently asked questions.
    </Typography>
  );
};

export const DefaultTourStepsMap: Record<InvoiceRouteUri, TourStepRange> = {
  [ViewInvoiceRouteUri]: {
    element: (
      <>
        {createHelperSentences("view / print", "invoices")}
        {DisplaySubHelperSection()}
      </>
    ),
    start: 0,
    end: ViewPdfHelpSteps.length,
  },
  [EditInvoiceRouteUri]: {
    element: (
      <>
        {createHelperSentences("edit / update", "invoices")}
        {DisplaySubHelperSection()}
      </>
    ),
    start: ViewPdfHelpSteps.length,
    end: ViewPdfHelpSteps.length + EditPdfHelpSteps.length,
  },
  [SenderInforamtionRouteUri]: {
    element: (
      <>
        {createHelperSentences("edit / update", "sender information")}
        {DisplaySubHelperSection()}
      </>
    ),
    start: ViewPdfHelpSteps.length + EditPdfHelpSteps.length,
    end:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length,
  },
  [RecieverInforamtionRouteUri]: {
    element: (
      <>
        {createHelperSentences("edit / update ", "reciever information")}
        {DisplaySubHelperSection()}
      </>
    ),
    start:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length,
    end:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length,
  },
  [InvoiceDashboardRouteUri]: {
    element: (
      <>
        {createHelperSentences("interpret", "the dashboard")}
        {DisplaySubHelperSection()}
      </>
    ),
    start:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length,
    end:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length,
  },
  [SettingsRouteUri]: {
    element: (
      <>
        {createHelperSentences(
          "edit / update",
          "your information and email templates",
        )}
        {DisplaySubHelperSection()}
      </>
    ),
    start:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length,
    end:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length +
      SettingsHelpSteps.length,
  },
  [RentalRouteUri]: {
    element: (
      <>
        {createHelperSentences("view", "your rental property details")}
        {DisplaySubHelperSection()}
      </>
    ),
    start:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length +
      SettingsHelpSteps.length,
    end:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length +
      SettingsHelpSteps.length +
      RentalHelpSteps.length,
  },
  [PropertyRouteUri]: {
    element: (
      <>
        {createHelperSentences("view", "your property details")}
        {DisplaySubHelperSection()}
      </>
    ),
    start:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length +
      SettingsHelpSteps.length +
      RentalHelpSteps.length,
    end:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length +
      SettingsHelpSteps.length +
      RentalHelpSteps.length +
      MyPropertyHelpSteps.length,
  },
  [PropertiesRouteUri]: {
    element: (
      <>
        {createHelperSentences("view", "your property details")}
        {DisplaySubHelperSection()}
      </>
    ),
    start:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length +
      SettingsHelpSteps.length +
      RentalHelpSteps.length +
      MyPropertyHelpSteps.length,
    end:
      ViewPdfHelpSteps.length +
      EditPdfHelpSteps.length +
      SenderInfoHelpSteps.length +
      RecieverInfoHelpSteps.length +
      DashboardHelpSteps.length +
      SettingsHelpSteps.length +
      RentalHelpSteps.length +
      MyPropertyHelpSteps.length +
      MyPropertiesListHelpSteps.length,
  },
};

/**
 * GeneratedTourSteps
 *
 * Generates tour steps based on router pathname and its criteria. Prefix the page with the associated
 * prefix string below and co-ordinate with data-tour options and props in each component.
 */
export const GeneratedTourSteps = [
  ...derieveTourSteps(ViewPdfHelpSteps, "view-pdf"),
  ...derieveTourSteps(EditPdfHelpSteps, "edit-pdf"),
  ...derieveTourSteps(SenderInfoHelpSteps, "sender"),
  ...derieveTourSteps(RecieverInfoHelpSteps, "reciever"),
  ...derieveTourSteps(DashboardHelpSteps, "dashboard"),
  ...derieveTourSteps(SettingsHelpSteps, "settings"),
  ...derieveTourSteps(RentalHelpSteps, "rental"),
  ...derieveTourSteps(MyPropertyHelpSteps, "property"),
  ...derieveTourSteps(MyPropertiesListHelpSteps, "properties"),
];
