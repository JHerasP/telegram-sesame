export function handleErrorCheckInOut(errorResponse: any, errorMessage: string) {
  if (errorResponse.statusCode === 422) {
    throw new Error(errorMessage);
  } else {
    throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");
  }
}
