import { useTranslations } from "next-intl";
import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import { isApiError } from "@/src/store/baseApi";

// The server sends its own message; errors made on the client (network, unknown) are worded here.
export function useErrorMessage() {
    const t = useTranslations("ClientErrors");

    return (error: unknown) => {
        if (!isApiError(error)) return t("unknown");
        if (error.code === API_ERROR_CODE.NETWORK_ERROR) return t("network");

        return error.message || t("unknown");
    };
}
