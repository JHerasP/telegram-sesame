type checkScreen = `CheckScreen: ${string}`;
export function isCheckScreen(
  test: checkScreen | taskScreen | requestAccessScreen | adminScreen | undefined
): test is checkScreen {
  return test?.includes("CheckScreen") || false;
}

type taskScreen = `taskScreen: ${string}`;
export function isTaskScreen(test: taskScreen | requestAccessScreen | adminScreen | undefined): test is taskScreen {
  return test?.includes("taskScreen") || false;
}

type requestAccessScreen = `requestAccessScreen: Meh.${string}`;
export function isRequestAccessScreen(
  test: requestAccessScreen | adminScreen | undefined
): test is requestAccessScreen {
  return test?.includes("requestAccessScreen") || false;
}

type adminScreen = `AdminMenu: id.${string}`;
export function isAdminScreen(test: adminScreen | undefined): test is adminScreen {
  return test?.includes("AdminMenu") || false;
}
