import { ElMessageBox, ElMessage } from "element-plus"

// variant for the type of success message and message box
type Variant = 'primary' | 'success' | "warning" | "info" | "error";

interface MessageBox {
   message: string 
   title: string 
   confirmText: string
   cancelText: string
   type: Variant 
   onSuccessText?: string 
   onCancelText?: string
    
}


/**
 * Used to show feedback after an activity
 * @param { string } message string
 * @param { boolean } closable boolean
 * @param { type } type 'primary' | 'success' | "warning" | "info" | "error"
 * @returns { ElMessage }
 */
export const useMessage = (message: string, closable: boolean, type: Variant ) => {
    ElMessage({ message: message, showClose: closable, type: type})    
}


/**
 * Displays a modal message box for alerts, confirmations, or prompts, mimicking system dialog behavior.
 *
 * @param {Object} data - Configuration object for the message box.
 * @param {string} data.message - The main message to display in the modal.
 * @param {string} data.title - The title of the message box.
 * @param {string} data.confirmText - The text for the confirmation button.
 * @param {string} data.cancelText - The text for the cancel button.
 * @param {'primary' | 'success' | 'warning' | 'info' | 'error'} data.type - Type of the message box (affects icon and style).
 * @param {string} [data.onSuccessText] - Optional success message to show if no success callback is provided.
 * @param {string} [data.onCancelText] - Optional cancel message to show if no cancel callback is provided.
 * @param {() => void} [onSuccess] - Optional callback invoked when the confirm button is clicked.
 * @param {() => void} [onCancel] - Optional callback invoked when the cancel button is clicked.
 * @returns {void}
 */

export const useMessageBox = (data: MessageBox, onSuccess?: () => void, onCancel?: () => void) => {

    const { message, title, confirmText, cancelText, type, onSuccessText, onCancelText } = data

    ElMessageBox.confirm(message, title, { confirmButtonText: confirmText, cancelButtonText:  cancelText, type: type})
    .then(() => {
        if(onSuccess) onSuccess();
        else useMessage(onSuccessText ?? 'Success', true, "success")
    })
    .catch(() => {
        if(onCancel) onCancel()
        useMessage(onCancelText ?? 'Cancel', true, "info")
    })
}