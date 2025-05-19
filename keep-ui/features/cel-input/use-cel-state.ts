import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const celQueryParamName = "cel";
const defaultOptions = { enableQueryParams: false, defaultCel: "" };

export function useCelState({
  enableQueryParams,
  defaultCel,
}: typeof defaultOptions) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [celState, setCelState] = useState(
    () => searchParams.get(celQueryParamName) || defaultCel || ""
  );

  // Clean up cel param when pathname changes
  useEffect(() => {
    return () => {
      const newParams = new URLSearchParams(window.location.search);
      if (newParams.has(celQueryParamName)) {
        newParams.delete(celQueryParamName);
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`
        );
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (!enableQueryParams) return;

    const params = new URLSearchParams(window.location.search);

    if (params.get(celQueryParamName) === celState) {
      return;
    }

    params.delete(celQueryParamName);

    if (celState && celState !== defaultCel) {
      params.set(celQueryParamName, celState);
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params}`
    );
  }, [celState, enableQueryParams, defaultCel]);


  return [celState, setCelState] as const;
}
