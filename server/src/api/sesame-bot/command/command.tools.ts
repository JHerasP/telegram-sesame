type checkScreen = `CheckScreen: ${string}`;
export function isCheckScreen(test: checkScreen | taskScreen | undefined): test is checkScreen {
  return test?.includes("CheckScreen") || false;
}

type taskScreen = `taskScreen: ${string}`;
export function isTaskScreen(test: taskScreen | undefined): test is taskScreen {
  return test?.includes("taskScreen") || false;
}
