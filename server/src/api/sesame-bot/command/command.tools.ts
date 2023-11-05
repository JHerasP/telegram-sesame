type checkScreen = `CheckScreen: ${string}`;
export function isCheckScreen(test: checkScreen | taskScreen | requestAccessScreen | undefined): test is checkScreen {
  return test?.includes("CheckScreen") || false;
}

type taskScreen = `taskScreen: ${string}`;
export function isTaskScreen(test: taskScreen | requestAccessScreen | undefined): test is taskScreen {
  return test?.includes("taskScreen") || false;
}

type requestAccessScreen = `requestAccessScreen: Meh.${string}`;
export function isRequestAccessScreen(test: requestAccessScreen | undefined): test is requestAccessScreen {
  return test?.includes("requestAccessScreen") || false;
}
