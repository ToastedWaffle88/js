import type { ThirdwebClient } from "../../../../../../client/client.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Container } from "../../../components/basic.js";
import { Text } from "../../../components/text.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../design-system/index.js";
import { USDIcon } from "../../icons/USDIcon.js";
import { useBuyWithFiatSupportedCurrencies } from "./swap/useBuyWithFiatSupportedCurrencies.js";

/**
 * Shows an amount "value" and renders the selected token and chain
 * It also renders the buttons to select the token and chain
 * It also renders the balance of active wallet for the selected token in selected chain
 * @internal
 */
export function PayWithCreditCard(props: {
  value?: string;
  isLoading: boolean;
  client: ThirdwebClient;
}) {
  const supportedCurrencies = useBuyWithFiatSupportedCurrencies(props.client);

  // TODO: fix this
  console.log({
    supportedCurrencies: supportedCurrencies.data,
  });

  return (
    <Container
      bg="tertiaryBg"
      borderColor="borderColor"
      py="md"
      px="sm"
      flex="row"
      style={{
        borderRadius: radius.md,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottom: "none",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        minHeight: "64px",
        alignItems: "center",
      }}
    >
      {/* Left */}
      <Container flex="row" center="y" gap="sm">
        <USDIcon size={iconSize.md} />
        <Text color="primaryText">USD</Text>
      </Container>

      {/* Right */}
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: spacing.xxs,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          justifyContent: "center",
          paddingRight: spacing.sm,
        }}
      >
        {props.isLoading ? (
          <Skeleton width="100px" height={fontSize.lg} />
        ) : (
          <Text size="lg" color={props.value ? "primaryText" : "secondaryText"}>
            {props.value ? `$${props.value}` : "--"}
          </Text>
        )}
      </div>
    </Container>
  );
}
