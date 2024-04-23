import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { Context as ToastContext } from "../../contexts/Toast";
import { create } from "../../axios/controllers/comment";

const shouldRetry = ({ response }) => response.status !== 400;

export default () => {
  const { openToast } = useContext(ToastContext);

  const { isPending, mutate } = useMutation({
    mutationFn: ({ body, score, product, article }) => create({ body, score, product, article }),
    retry: (failureCount, error) => shouldRetry(error) && failureCount < 2,
    onSuccess: () => openToast("success", null, "دیدگاه شما با موفقیت ثبت شد."),
    onError: () => openToast("error", null, "اطلاعات وارد شده معتبر نمی‌باشد."),
  });

  return { isPendingCreateComment: isPending, createComment: mutate };
};