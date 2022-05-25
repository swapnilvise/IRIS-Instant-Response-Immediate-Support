//antd
import { message } from "antd";

export function generateErrorToast(msg) {
  message.error(msg);
}
export function generateSuccessToast(msg) {
  message.success(msg);
}
export function generateWarningToast(msg) {
  message.warning(msg);
}
