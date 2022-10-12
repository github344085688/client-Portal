
import { Message } from 'element-ui';
class ErrorHandler {

    handle(err: any | string) {
        // TODO;
        if (typeof err === "string") {
            Message.error(err);
        } else {
            try {
                let response = err.response;
                let textDecoder = new TextDecoder("utf-8");
                let unitArray = new Uint8Array(response.data);
                let errorString = textDecoder.decode(unitArray);
                let msg = JSON.parse(errorString).error;
                Message.error(msg);
            } catch (error) {
                let response = err.response;
                let errMsg = response.error || (response.data || response.data.message || response.data.errorMessage.message) ? (response.data.error || response.data.message || response.data.errorMessage.message || response.data.errorMessage) : "Server Interal Error.";
                let xrequestID = this.getResponseXRequestID(response);
                if (xrequestID) {
                    errMsg = errMsg + ` (Request ID: ${xrequestID})`;
                }
                if (errMsg) {
                    Message.error(errMsg);
                } else {
                    Message.error("Internal Server Error");
                }
            }
        }
    }

    private getResponseXRequestID(response: any) {
        return response.headers["x-request-id"];
    }
}

export default new ErrorHandler();