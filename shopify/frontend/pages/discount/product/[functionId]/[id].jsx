import { useState } from "react";
import { useForm, useField } from "@shopify/react-form";
import { useParams } from "react-router-dom";
import { CurrencyCode } from "@shopify/react-i18n";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";

import {
  DiscountMethod,
  DiscountStatus,
  RequirementType,
  SummaryCard,
  onBreadcrumbAction,
} from "@shopify/discount-app-components";
import {
  Banner,
  Layout,
  Page,
  PageActions,
  Spinner,
  Modal,
  TextContainer,
} from "@shopify/polaris";

import metafields from '../../../../metafields'
import { useAuthenticatedFetch, useDiscount } from "../../../../hooks";

const todaysDate = new Date();

export default function VolumeNew() {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const currencyCode = CurrencyCode.Cad;
  const authenticatedFetch = useAuthenticatedFetch();
  const { id } = useParams();
  const { discount, isLoading } = useDiscount(id);
  const [deleteModalActive, setDeleteModalActive] = useState(false);

  const {
    fields: {
      discountTitle,
      discountCode,
      discountMethod,
      requirementType,
      requirementSubtotal,
      requirementQuantity,
      usageTotalLimit,
      usageOncePerCustomer,
      startDate,
      endDate,
      configuration,
    },
    submit,
    submitting,
    dirty,
    reset,
    submitErrors,
    makeClean,
  } = useForm({
    fields: {
      discountTitle: useField(discount?.title || ""),
      discountMethod: useField(discount?.method || DiscountMethod.Code),
      discountCode: useField(discount?.code || ""),
      combinesWith: useField(
        discount?.combinesWith || {
          orderDiscounts: false,
          productDiscounts: false,
          shippingDiscounts: false,
        }
      ),
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      usageTotalLimit: useField(discount?.usageLimit || null),
      usageOncePerCustomer: useField(discount?.appliesOncePerCustomer || false),
      startDate: useField(discount?.startsAt || todaysDate),
      endDate: useField(discount?.endsAt || null),
      configuration: {
        // Add quantity and percentage configuration
        quantity: useField(discount?.configuration?.quantity || "1"),
        percentage: useField(discount?.configuration?.percentage || "0"),
      },
    },
    onSubmit: async (form) => {
      const updatedDiscount = {
        combinesWith: form.combinesWith,
        startsAt: form.startDate,
        endsAt: form.endDate,
        metafields: [
          {
            id: discount.configurationId, // metafield id is required for update
            namespace: metafields.namespace,
            key: metafields.key,
            type: "json",
            value: JSON.stringify({
              quantity: parseInt(form.configuration.quantity),
              percentage: parseFloat(form.configuration.percentage),
            }),
          },
        ],
      };

      let uri = `/api/discounts/`;
      if (form.discountMethod === DiscountMethod.Code) {
        uri += "code/";

        updatedDiscount.usageLimit = parseInt(form.usageTotalLimit);
        updatedDiscount.appliesOncePerCustomer = form.usageOncePerCustomer;
        updatedDiscount.code = form.discountCode;
        updatedDiscount.title = form.discountCode;
      } else {
        uri += "automatic/";

        updatedDiscount.title = form.discountTitle;
      }

      let response = await authenticatedFetch(uri + id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: updatedDiscount }),
      });

      const {
        errors, // errors like missing scope access
        data,
      } = await response.json();

      const remoteErrors = errors || data?.discountUpdate?.userErrors;

      if (remoteErrors?.length > 0) {
        return { status: "fail", errors: remoteErrors };
      }

      redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
        name: Redirect.ResourceType.Discount,
      });

      return { status: "success" };
    },
  });

  const handleDeleteDiscount = async () => {
    await authenticatedFetch(
      `/api/discounts/${
        discountMethod.value === DiscountMethod.Automatic ? "automatic" : "code"
      }/${discount.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
      name: Redirect.ResourceType.Discount,
    });
  };

  const toggleDeleteModalActive = () => {
    setDeleteModalActive((deleteModalActive) => !deleteModalActive);
  };

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        <Banner status="critical">
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(({ message }, index) => {
              return <li key={`${message}${index}`}>{message}</li>;
            })}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null;

  return (
    <Page
    title="Edit Product Discount"

      breadcrumbs={[
        {
          content: "Discounts",
          onAction: () => onBreadcrumbAction(redirect, true),
        },
      ]}
      primaryAction={{
        content: "Save",
        onAction: submit,
        disabled: !dirty,
        loading: submitting,
      }}
    >
      {isLoading && (
        <Layout>
          <Stack distribution="center">
            <Spinner size="large" />
          </Stack>
        </Layout>
      )}

      {!isLoading && (
        <Layout>
          {errorBanner}
          <Layout.Section>
          <form onSubmit={submit}>
            <LegacyCard>
                <LegacyCard.Section title="Value">
                    <DiscountAmount />
                </LegacyCard.Section>
                <LegacyCard.Section title="Purchase Type">
                    <PurchaseTypeSection purchaseType={PurchaseType.Both} />
                </LegacyCard.Section>
                <LegacyCard.Section title="Applies To">
                    <AppliesTo />
                </LegacyCard.Section>
            </LegacyCard>
            <MinReqsCard />
            <MaxUsageCard />
            <CombinationsCard />
            <ActiveDatesCard />
          </form>
          </Layout.Section>
          <Layout.Section secondary>
            <SummaryCard
              header={{
                discountMethod: discountMethod.value,
                discountDescriptor:
                  discountMethod.value === DiscountMethod.Automatic
                    ? discountTitle.value
                    : discountCode.value,
                appDiscountType: "Volume",
                isEditing: false,
              }}
              performance={{
                status: DiscountStatus.Scheduled,
                usageCount: 0,
              }}
              minimumRequirements={{
                requirementType: requirementType.value,
                subtotal: requirementSubtotal.value,
                quantity: requirementQuantity.value,
                currencyCode: currencyCode,
              }}
              usageLimits={{
                oncePerCustomer: usageOncePerCustomer.value,
                totalUsageLimit: usageTotalLimit.value,
              }}
              activeDates={{
                startDate: startDate.value,
                endDate: endDate.value,
              }}
            />
          </Layout.Section>
          <Layout.Section>
            <PageActions
              primaryAction={{
                content: "Save discount",
                onAction: submit,
                disabled: !dirty,
                loading: submitting,
              }}
              secondaryActions={[
                {
                  content: "Delete",
                  destructive: true,
                  onAction: toggleDeleteModalActive,
                },
              ]}
            />
          </Layout.Section>

          <Modal
            small
            open={deleteModalActive}
            onClose={toggleDeleteModalActive}
            title="Delete discount"
            primaryAction={{
              content: "Delete",
              destructive: true,
              onAction: handleDeleteDiscount,
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: toggleDeleteModalActive,
              },
            ]}
          >
            <Modal.Section>
              <TextContainer>
                <p>Are you sure you want to delete this discount?</p>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </Layout>
      )}
    </Page>
  );
}
