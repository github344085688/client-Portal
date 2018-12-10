
import { Message } from 'element-ui';
class ErrorHandler {

    handle(err: any | string) {
        // TODO;
        if (typeof err === "string") {
            Message.error(err);
        } else {
            let response = err.response;
            let errMsg = response.error || response.data ? response.data.error : "Server Interal Error.";
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

    private getResponseXRequestID(response: any) {
        return response.headers["x-request-id"];
    }
}

export default new ErrorHandler();