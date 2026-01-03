/**
 * Invoice types
 */
import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import type { SxProps, Theme } from "@mui/material/styles";

/**
 * The type `InvoiceAppBreadcrumb` represents a breadcrumb item in an invoice application with a value
 * and an icon.
 * @property {string} value - The `value` property in the `InvoiceAppBreadcrumb` type represents the
 * text or label associated with a breadcrumb in an invoice application.
 * @property {ReactNode} icon - The `icon` property in the `InvoiceAppBreadcrumb` type represents a
 * ReactNode, which is a common data type in React applications used to represent a node in the virtual
 * DOM. This property is likely used to store an icon component that can be rendered within the
 * breadcrumb component.
 */
export type InvoiceAppBreadcrumb = {
  value: string;
  icon: ReactNode;
};

/**
 * The InvoiceAppRouteConfig type defines configuration options for a route in an invoice application.
 * @property {InvoiceAppBreadCrumb} breadCrumb - The `breadCrumb` property in the
 * `InvoiceAppRouteConfig` type represents the breadcrumb configuration for the route. Breadcrumbs are
 * typically used for navigation and provide a trail for users to understand their current location
 * within the application. The `breadCrumb` property likely contains information such as the text
 * @property {boolean} displayInNavBar - The `displayInNavBar` property in the `InvoiceAppRouteConfig`
 * type indicates whether the route should be displayed in the navigation bar of the application. If
 * set to `true`, the route will be shown in the navigation bar; if set to `false`, it will not be
 * displayed in the
 * @property {boolean} displayHelpSelector - The `displayHelpSelector` property in the
 * `InvoiceAppRouteConfig` type indicates whether a help selector should be displayed in the user
 * interface. If `displayHelpSelector` is set to `true`, it means that the UI should include an option
 * for the user to access help or support related to
 * @property {boolean} displayPrintSelector - The `displayPrintSelector` property in the
 * `InvoiceAppRouteConfig` type indicates whether the option to print the invoice should be displayed
 * in the user interface. If `displayPrintSelector` is set to `true`, the print option will be
 * available to the user, allowing them to print the invoice
 */
export type InvoiceAppRouteConfig = {
  breadcrumb: InvoiceAppBreadCrumb;
  displayInNavBar: boolean;
  displayHelpSelector: boolean;
  displayPrintSelector: boolean;
};

/**
 * The type `InvoiceAppRoute` defines the structure of a route in an invoice application.
 * @property {number} id - The `id` property in the `InvoiceAppRoute` type represents the unique
 * identifier for a specific route in the Invoice App. Each route should have a distinct `id` to
 * differentiate it from other routes.
 * @property {string} label - The `label` property in the `InvoiceAppRoute` type represents the text
 * label or title associated with the route. It is typically used to display the name of the route in
 * navigation menus or page headers.
 * @property {string} path - The `path` property in the `InvoiceAppRoute` type represents the URL path
 * for the route. It specifies the location where the route can be accessed within the application. For
 * example, if the `path` is set to "/invoices", the route will be accessible at the URL `https://
 * @property {string} routeUri - The `routeUri` property in the `InvoiceAppRoute` type represents the
 * URI path for the route. It is a string that defines the path of the route within the application.
 * @property {ReactNode} element - The `element` property in the `InvoiceAppRoute` type represents the
 * React component that will be rendered when the route is accessed. It should be a valid ReactNode,
 * such as a component or JSX element.
 * @property {ReactNode} icon - The `icon` property in the `InvoiceAppRoute` type is used to specify
 * the icon component that represents the route. This icon can be a ReactNode, which allows you to use
 * any valid React element as the icon for the route. It is typically used to visually represent the
 * route in navigation
 * @property {string[]} requiredFlags - The `requiredFlags` property in the `InvoiceAppRoute` type is
 * an array of strings that represent the flags required for accessing this particular route in the
 * Invoice App. These flags might be used for authentication, authorization, or any other purpose to
 * control access to the route.
 * @property {InvoiceAppRouteConfig} config - The `config` property in the `InvoiceAppRoute` type
 * likely contains additional configuration settings or options specific to the route. It could include
 * things like route-specific settings, permissions, or any other custom configurations needed for that
 * particular route in the Invoice App.
 */
export type InvoiceAppRoute = {
  id: number;
  label: string;
  path: string;
  routeUri: string;
  element: ReactNode;
  icon: ReactNode;
  requiredFlags: string[];
  config: InvoiceAppRouteConfig;
};

/**
 * The WidgetConfig type defines the configuration properties for a widget, including inset, height,
 * width, and widgetId.
 * @property {boolean} inset - The `inset` property in the `WidgetConfig` type indicates whether the
 * widget has an inset style or not. It is a boolean value, meaning it can be either `true` or `false`.
 * @property {string} height - The `height` property in the `WidgetConfig` type represents the height
 * of the widget. It is a string type, which means it can store values like "100px", "50%", "auto",
 * etc.
 * @property {string} width - The `width` property in the `WidgetConfig` type represents the width of
 * the widget and is of type string.
 * @property {string} widgetId - The `widgetId` property in the `WidgetConfig` type represents the
 * unique identifier for a specific widget. It is a string type that is used to distinguish one widget
 * from another.
 */
export type WidgetConfig = {
  inset: boolean; // makes text have extra spacing infront
  height: string;
  width: string;
  widgetId: string; // for provision only
};

/**
 * The WidgetType type defines the structure of a widget with specific properties such as id, label,
 * caption, columns, and config.
 * @property {number} id - The `id` property in the `WidgetType` type represents a unique identifier
 * for the widget. It is of type `number`.
 * @property {string} label - The `label` property in the `WidgetType` type represents the label or
 * name of the widget. It is a string type.
 * @property {string} caption - The `caption` property in the `WidgetType` type represents a short
 * description or title for the widget. It is typically used to provide additional context or
 * information about the widget.
 * @property {string[]} columns - The `columns` property in the `WidgetType` type represents an array
 * of strings that define the columns for the widget. Each string in the array corresponds to a
 * specific column in the widget's layout.
 * @property {WidgetConfig} config - WidgetConfig is a type that represents the configuration settings
 * for a widget. It could include various properties such as color, size, visibility settings, etc. The
 * specific properties included in the WidgetConfig type would depend on the requirements of your
 * application.
 */
export type WidgetType = {
  id: number;
  label: string;
  caption: string;
  columns: string[];
  data: string[];
  config: WidgetConfig;
};

/**
 * The AddWidgetProps type defines a property handleAddWidget that takes a widgetId parameter of type
 * number and returns void.
 * @property handleAddWidget - The `handleAddWidget` property is a function that takes a `widgetId`
 * parameter of type number and returns void. It is typically used to add a widget with the specified
 * `widgetId`.
 */
export type AddWidgetProps = {
  handleAddWidget: (widgetId: number) => void;
};

/**
 * The type `InvoiceStatusOption` represents an option for the status of an invoice with specific
 * properties.
 * @property {number} id - The `id` property in the `InvoiceStatusOption` type represents the unique
 * identifier for an invoice status option.
 * @property {string} label - The `label` property in the `InvoiceStatusOption` type represents the
 * text that describes the status option. It is typically used to display the status option to users in
 * a user interface.
 * @property {ReactNode} icon - The `icon` property in the `InvoiceStatusOption` type is of type
 * `ReactNode`. This means that it can accept any valid React node, such as a JSX element, a string, a
 * number, a boolean, null, or undefined. It is typically used to represent an icon or
 * @property {boolean} selected - The `selected` property in the `InvoiceStatusOption` type indicates
 * whether the option is currently selected or not. It is a boolean value that determines the state of
 * the option in the user interface.
 * @property {boolean} display - The `display` property in the `InvoiceStatusOption` type represents
 * whether the option should be displayed or not. If `display` is `true`, the option should be shown to
 * the user, and if `display` is `false`, the option should be hidden or not rendered in the user
 */
export type InvoiceStatusOption = {
  id: number;
  label: string;
  icon: ReactNode;
  selected: boolean;
  display: boolean;
};

/**
 * The above type defines a Category object with a label property of type string.
 * @property {string} label - The `Category` type consists of a single property `label` of type string.
 */
export type Category = {
  label: string;
  value: string;
};

/**
 * The LineItem type in TypeScript represents an item with payment information, payment method, and
 * category.
 * @property {number} payment - The `payment` property in the `LineItem` type represents the amount of
 * payment associated with the line item. It is a number type.
 * @property {string} paymentMethod - The `paymentMethod` property in the `LineItem` type represents
 * the method used for payment, such as credit card, cash, or online payment service. It is a string
 * type in the LineItem object.
 * @property {Category} category - The `category` property in the `LineItem` type represents the
 * category to which the line item belongs. It is of type `Category`.
 */
export type LineItem = {
  payment: number;
  paymentMethod: string;
  category: Category;
};

/**
 * The Invoice type in TypeScript represents an invoice with line items, status, start and end dates,
 * and update timestamp.
 * @property {LineItem[]} lineItems - LineItem[] - an array of line items included in the invoice
 * @property {string} invoiceStatus - The `invoiceStatus` property in the `Invoice` type represents the
 * status of the invoice, such as "paid", "pending", "overdue", etc. It indicates the current state of
 * the invoice in terms of payment or processing.
 * @property {string} startDate - The `startDate` property in the `Invoice` type represents the date
 * when the invoice period starts. It is a string type, which means it should store a date in a
 * specific format, such as "YYYY-MM-DD".
 * @property {string} endDate - The `endDate` property in the `Invoice` type represents the date when
 * the invoice period ends. It is a string type in the format of a date.
 * @property {string} updatedOn - The `updatedOn` property in the `Invoice` type represents the date
 * and time when the invoice was last updated. It is a string type that typically stores a timestamp or
 * date in a specific format, such as "YYYY-MM-DD HH:MM:SS".
 */
export type Invoice = {
  lineItems: LineItem[];
  invoiceStatus: string;
  taxRate: number;
  startDate: Dayjs;
  endDate: Dayjs;
  updatedOn: Dayjs;
};

/**
 * The InvoiceRow type defines the structure of an invoice row with various properties such as
 * category, invoice status, dates, total amount, payment method, and updated timestamp.
 * @property {string} category - Category is a string that represents the category of the invoice row,
 * such as "Utilities", "Rent", "Services", etc.
 * @property {string} invoiceStatus - The `invoiceStatus` property in the `InvoiceRow` type represents
 * the status of the invoice. It could indicate whether the invoice is pending, paid, overdue, or any
 * other status related to the payment of the invoice.
 * @property {Dayjs} startDate - The `startDate` property in the `InvoiceRow` type represents the date
 * when the invoice row starts. It is an optional property, indicated by the `?` symbol after the
 * property name, meaning it may or may not be present in an `InvoiceRow` object. The type of
 * `startDate
 * @property {Dayjs} endDate - The `endDate` property in the `InvoiceRow` type represents the date when
 * the invoice period ends. It is an optional property, indicated by the `?` symbol after the property
 * name, meaning it may or may not be present in an `InvoiceRow` object. The `endDate` is
 * @property {number} total - The `total` property in the `InvoiceRow` type represents the total amount
 * for the invoice row, typically denoted in a numerical value (e.g., 100.50). It is used to indicate
 * the total cost or amount associated with the specific invoice row.
 * @property {string} paymentMethod - The `paymentMethod` property in the `InvoiceRow` type represents
 * the method used for payment for the invoice. It could be a credit card, bank transfer, cash, or any
 * other form of payment method specified as a string value.
 * @property {Dayjs} updatedOn - The `updatedOn` property in the `InvoiceRow` type represents the date
 * and time when the invoice row was last updated. It is of type `Dayjs`, which is a library for
 * handling dates and times in JavaScript.
 */
export type InvoiceRow = {
  category: string;
  invoiceStatus: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  total: number;
  paymentMethod: string;
  updatedOn: Dayjs;
};

/**
 * The ItemTypeChartRow type defines the structure of a chart row item with label, data, background
 * color, and border width properties.
 * @property {string} label - The `label` property in the `ItemTypeChartRow` type represents the label
 * associated with the data in the chart row. It is a string type.
 * @property {ItemFrequency[]} data - The `data` property in the `ItemTypeChartRow` type represents an
 * array of `ItemFrequency` objects. Each `ItemFrequency` object likely contains information about the
 * frequency of a specific item.
 * @property {string} backgroundColor - The `backgroundColor` property in the `ItemTypeChartRow` type
 * represents the color that will be used as the background color for the chart row. It is a string
 * type that should contain a valid color value, such as a color name (e.g., "red") or a hexadecimal
 * color code (
 * @property {Number} borderWidth - The `borderWidth` property in the `ItemTypeChartRow` type
 * represents the width of the border for the chart row. It is a numerical value that specifies the
 * thickness of the border in the chart.
 */
export type ItemTypeChartRow = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  fill: boolean;
  tension: number;
};

/**
 * The type `InvoiceItemTypeChartData` represents chart data for invoice item types with labels and
 * datasets.
 * @property {string[]} labels - The `labels` property in the `InvoiceItemTypeChartData` type
 * represents an array of strings that are used as labels for the data in the chart. These labels
 * typically describe the categories or items being represented in the chart.
 * @property {ItemTypeChartRow[]} datasets - The `datasets` property in the `InvoiceItemTypeChartData`
 * type represents an array of `ItemTypeChartRow` objects. Each `ItemTypeChartRow` object contains data
 * for a specific row in the chart, such as values, colors, and other properties related to that row.
 */
export type InvoiceItemTypeChartData = {
  labels: string[];
  datasets: ItemTypeChartRow[];
};

/**
 * The type MonthTotal represents the total amount collected and the tax for a specific month.
 * @property {number} collected - The `collected` property in the `MonthTotal` type represents the
 * total amount collected for a specific month.
 * @property {number} tax - The `tax` property in the `MonthTotal` type represents the amount of tax
 * collected for a specific month.
 */
export type MonthTotal = {
  collected: number;
  tax: number;
};

/**
 * The TrendsChartDataset type in TypeScript represents a dataset for a trends chart with labels and
 * item type chart rows.
 * @property {string[]} labels - The `labels` property in the `TrendsChartDataset` type represents an
 * array of strings that are used as labels for the data points in the chart. These labels typically
 * provide context or information about the data being displayed on the chart.
 * @property {ItemTypeChartRow[]} datasets - The `datasets` property in the `TrendsChartDataset` type
 * represents an array of `ItemTypeChartRow` objects. Each `ItemTypeChartRow` object likely contains
 * data for a specific item in the chart, such as its values or other relevant information.
 */
export type TrendsChartDataset = {
  labels: string[];
  datasets: ItemTypeChartRow[];
};

/**
 * The TimeLineChartDataset type in TypeScript represents a dataset for a timeline chart with labels
 * and item type chart rows.
 * @property {string[]} labels - The `labels` property in the `TimeLineChartDataset` type represents an
 * array of strings that are used as labels for the data points in the timeline chart. These labels
 * typically correspond to specific time periods or categories along the x-axis of the chart.
 * @property {ItemTypeChartRow[]} datasets - The `datasets` property in the `TimeLineChartDataset` type
 * represents an array of `ItemTypeChartRow` objects. Each `ItemTypeChartRow` object typically contains
 * data for a specific item or category that will be displayed on the timeline chart.
 */
export type TimeLineChartDataset = {
  labels: string[];
  datasets: ItemTypeChartRow[];
};

/**
 * The DetailsTableViewProps type defines props for a details table view component with label and
 * caption fields.
 * @property {string} label - The `label` property in the `DetailsTableViewProps` type represents the
 * label associated with the details being displayed in the table view. It is a string type that
 * describes or names the details being shown.
 * @property {string} caption - The `caption` property in the `DetailsTableViewProps` type represents a
 * string that provides additional information or context related to the `label` property. It is
 * typically used to describe or explain the data or content associated with the `label`.
 */
export type DetailsTableViewProps = {
  label: string;
  caption: string;
};

/**
 * The InvoiceRowHeader type in TypeScript defines the structure of a header row in an invoice,
 * including title, caption, optional date display, created date, styling props, and children.
 * @property {string} title - The `title` property in the `InvoiceRowHeader` type represents the title
 * of the invoice row. It is a string type.
 * @property {string} caption - The `caption` property in the `InvoiceRowHeader` type represents a
 * short description or label for the header. It is typically used to provide additional context or
 * information about the title of the header.
 * @property {boolean} showDate - The `showDate` property in the `InvoiceRowHeader` type is a boolean
 * that indicates whether the date should be displayed in the invoice row. If `showDate` is set to
 * `true`, the date will be shown; if it's set to `false` or not provided, the
 * @property {Dayjs} createdDate - The `createdDate` property in the `InvoiceRowHeader` type represents
 * the date when the invoice row was created. It is of type `Dayjs`, which is a popular library for
 * handling dates and times in JavaScript. This property is optional, meaning it does not have to be
 * provided when creating
 * @property sxProps - The `sxProps` property in the `InvoiceRowHeader` type is an optional property
 * that allows you to pass styling props using Theme UI's `SxProps` type. This can be used to apply
 * custom styles to the component using the Theme UI theme object.
 * @property {ReactNode} children - The `children` property in the `InvoiceRowHeader` type is a
 * ReactNode type, which means it can accept any valid React node as its value. This allows you to
 * include nested components, text, or any other React elements within the `InvoiceRowHeader`
 * component.
 */
export type InvoiceRowHeader = {
  title: string;
  caption: string;
  showDate?: boolean;
  createdDate?: Dayjs;
  sxProps?: SxProps<Theme>;
  children?: ReactNode;
};
