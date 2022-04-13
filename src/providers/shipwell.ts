import axios from "axios";
import yaml from "js-yaml";
import { OpenAPI3Schema } from "../provider";
import { OpenAPIProvider } from "./openapi";

export class ShipwellProvider extends OpenAPIProvider {
  constructor() {
    super({
      name: "Shipwell",
      description:
        "Shipwell is a freight trucking startup that provides business with automated way transport of goods and services. ",
      logoUrl: "https://logo.clearbit.com/shipwell.com",
      versions: ["v2"],
      baseUrl: "https://shipwell-postman-collection.s3.us-east-2.amazonaws.com/public-swagger.yaml",
      docsLink: "https://docs.shipwell.com",
      sanitizeSchema,
      entities: [
        "AbstractChargeLineItem",
        "Accessorial",
        "AccessorialChargeTable",
        "Address",
        "AddressBookEntry",
        "AlertDashboardSlimShipment",
        "AlertsDashBoardConfiguration",
        "AlertsDashBoardConfigurationOptions",
        "ApiKey",
        "AutomatedVendorProfile",
        "AutomationEvent",
        "BaseCarrierRelationship",
        "BasePointOfContact",
        "BaseProductDescription",
        "BaseShipment",
        "Bill",
        "BillLineItem",
        "BillRemitTo",
        "BillToOverride",
        "Brokerage",
        "BulkCreateSpotNegotiationRequest",
        "BulkPrintLabelsResponse",
        "CallLogRead",
        "CallLogShipmentSummary",
        "CallLogWrite",
        "Carrier",
        "CarrierAssignment",
        "CarrierBid",
        "CarrierBiddingSummaryShipment",
        "CarrierConfig",
        "CarrierPocTag",
        "CarrierPointOfContact",
        "CarrierPrioritizationRecommendation",
        "CarrierRelationship",
        "CarrierSpecificShipperRelationship",
        "CarrierStatusCarrierAssignment",
        "CarrierTag",
        "CaseNote",
        "Company",
        "CompanyLogo",
        "CompanyPreferences",
        "CompanyWithOptionalUsers",
        "Contract",
        "CrFeedback",
        "CrRecommendationResponse",
        "CrRecommendationShipment",
        "CrRecommendationShipmentResponse",
        "CreateCompanyRequestBody",
        "CreateEquipmentConfig",
        "CreateQuote",
        "CreateShipmentTimelineEvent",
        "CreateShipperRelationship",
        "CreateSpotNegotiationQuote",
        "CurrentShipmentAddress",
        "CustomField",
        "CustomFieldAllowedValue",
        "Dashboard",
        "DataDocksAppointment",
        "DataDocksStopAppointment",
        "DataImport",
        "DataImportError",
        "DocumentAuditlog",
        "DocumentMetadata",
        "Driver",
        "ELDCredentials",
        "ELDDeviceLocation",
        "ELDDriversCreated",
        "ELDLocation",
        "ELDLocationUpdateRequest",
        "ETAWindow",
        "EquipmentConfig",
        "EquipmentType",
        "EquipmentTypes",
        "FMCSACarrierPolicy",
        "FeatureFlags",
        "FedexAccount",
        "FedexAccountResponse",
        "FedexFreightAccount",
        "FedexPackaging",
        "FedexShipmentOptions",
        "FmcsaCarrier",
        "FmcsaCensusData",
        "FuelSurchargeTable",
        "FuelSurchargeTableCalculationRow",
        "GenesisAddress",
        "GenesisShipmentOptions",
        "GroupedEnum",
        "Hazmat",
        "HoursOfService",
        "HoursOfServiceResponse",
        "IdentifyingCode",
        "ImportColumnMapping",
        "ImportJob",
        "ImportRow",
        "ImportValue",
        "InboxMessage",
        "InitiateCheckCallRequest",
        "Invoice",
        "InvoiceEmailResponse",
        "InvoiceUpdateRequest",
        "LinearFeetEstimate",
        "LinkDriver",
        "LoadBoardShipment",
        "LocationRating",
        "LoginResponse",
        "Markup",
        "MessageListShipmentMessage",
        "NMFC",
        "NetsuiteCategoryOptions",
        "NetsuiteCompanyOptions",
        "NetsuiteConfig",
        "NetsuiteConfigCategoryMapping",
        "NetsuiteConfigCategoryMappings",
        "NetsuiteConfigFieldMappings",
        "NetsuiteCustomField",
        "NetsuiteCustomFieldOptions",
        "NotificationPreference",
        "OperatingAuthority",
        "OrderConsolidationPolicyCustomer",
        "OrderConsolidationPolicyProduct",
        "OrderConsolidationPolicySupplier",
        "PackageType",
        "PhoneNumberLookup",
        "PieceType",
        "PointOfContact",
        "PointOfContactNotificationPreferences",
        "Policy",
        "PostCompaniesCompanyidUsers",
        "PostProducts",
        "PowerUnit",
        "Product",
        "PurchaseOrder",
        "PurchaseOrderAlert",
        "PurchaseOrderLineItem",
        "PurchaseOrderResponse",
        "QuickbooksAuthDetails",
        "QuickbooksExpensesCategoryMapping",
        "QuickbooksGLAccount",
        "QuickbooksItem",
        "QuickbooksItemCategoryMapping",
        "Quote",
        "QuoteChargeLineItem",
        "RFQ",
        "RMISAPIAccountResponse",
        "RMISCarrier",
        "RMISCarrierProfile",
        "RMISClientCarrierAgreement",
        "RMISClientCarrierAgreementRuleOverride",
        "RMISContact",
        "RMISCoverage",
        "RMISCoverageLimits",
        "RMISDocument",
        "RMISDot",
        "RMISDotSmsSafety",
        "RMISDotTestingInfo",
        "RMISFTPAccountResponse",
        "RMISJobStatus",
        "RMISOverride",
        "RMISW9",
        "RecordedELDProvider",
        "RecordedEquipmentType",
        "RegisterFedex",
        "RegisterFedexResponse",
        "RegisterUPS",
        "SaferWatchAccountResponse",
        "SaferWatchAuthority",
        "SaferWatchCargo",
        "SaferWatchCarrier",
        "SaferWatchCarrierPolicy",
        "SaferWatchCertData",
        "SaferWatchCertificate",
        "SaferWatchCoverage",
        "SaferWatchCrash",
        "SaferWatchDrivers",
        "SaferWatchEquipment",
        "SaferWatchFmcsaInsurance",
        "SaferWatchIdentity",
        "SaferWatchInspection",
        "SaferWatchOperation",
        "SaferWatchPolicyItem",
        "SaferWatchReview",
        "SaferWatchRiskAssessment",
        "SaferWatchSafety",
        "ScheduleShipmentPickupRequest",
        "SendDocument",
        "ServiceLevelAgreement",
        "ShareShipment",
        "Shipment",
        "ShipmentCase",
        "ShipmentChargeLineItem",
        "ShipmentDocumentMetadata",
        "ShipmentLineItem",
        "ShipmentMessage",
        "ShipmentMetadata",
        "ShipmentModeStatus",
        "ShipmentNote",
        "ShipmentPickup",
        "ShipmentRep",
        "ShipmentRoute",
        "ShipmentRouteLeg",
        "ShipmentSpotNegotiation",
        "ShipmentTag",
        "ShipmentTimelineEvent",
        "Shipper",
        "ShipperRelationship",
        "ShipwellError",
        "ShipwellHistoricalPricingSinglePrice",
        "ShopifyLogin",
        "ShopifySettings",
        "SlimCarrierAssignment",
        "SlimCarrierRelationship",
        "SlimCarrierStatusCarrierAssignment",
        "SlimCompany",
        "SlimRFQ",
        "SlimRMISCarrier",
        "SlimRMISCoverage",
        "SlimRMISDot",
        "SlimRMISDotTestingInfo",
        "SlimSaferWatchAuthority",
        "SlimSaferWatchCarrier",
        "SlimSaferWatchCertData",
        "SlimSaferWatchCoverage",
        "SlimSaferWatchFMCSAInsurance",
        "SlimSaferWatchPolicyItem",
        "SlimSaferWatchRiskAssessment",
        "SlimShipment",
        "SlimShipmentLineItem",
        "SlimUser",
        "SpotNegotiation",
        "SpotNegotiationMessage",
        "Stop",
        "StopAlert",
        "StopLocation",
        "SupplierInvite",
        "SupplierInviteResponse",
        "Task",
        "TenderAcceptReject",
        "TenderAppointmentEventRequest",
        "TenderBase",
        "TenderCreate",
        "TenderEquipmentEventRequest",
        "TenderEtaEventRequest",
        "TenderEventRequest",
        "TenderGet",
        "TenderLocationEventRequest",
        "TenderRequest",
        "TenderRequestVendor",
        "TenderShipmentStateEventRequest",
        "TenderStopLocationEventRequest",
        "TextMessageTemplates",
        "Trailer",
        "TriumphPayAuthDetails",
        "TriumphPayCarrierPaymentAccount",
        "TriumphPayVendor",
        "TriumphPayVendorPaymentAccountData",
        "TriumphPayVendorPaymentAccountDataWithFactorCompanyChangeDocuments",
        "TruckloadHistoricalPricingListResponse",
        "TruckloadHistoricalPricingRequest",
        "TruckloadHistoricalPricingResponse",
        "TruckloadHistoricalSingleSourceAggregate",
        "TruckloadPredictivePricingPrice",
        "TruckloadPricingRequest",
        "UPSAccount",
        "UPSPackaging",
        "UPSShipmentOptions",
        "USPSAccount",
        "USPSPackaging",
        "USPSShipmentOptions",
        "User",
        "UserDashboardConfiguration",
        "UserPreferences",
        "ValidatedAddress",
        "VehicleLocation",
        "Vendor",
        "VendorFactoringCompany",
        "VendorRelationship",
      ],
    });
  }

  override async getSchema(version: string): Promise<OpenAPI3Schema> {
    const definition = await axios.get(this.baseUrl!);

    return {
      type: "openapi-v3",
      versionName: version,
      value: yaml.load(definition.data),
      entities: this.entities,
    };
  }
}

function sanitizeSchema(schema: unknown) {
  return JSON.parse(
    JSON.stringify(schema, (key, value) => {
      return value;
    }),
  );
}