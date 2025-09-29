export type WorkerExecuteMessage = {
  type: "execute";
  bundle: string;
};

export type WorkerLogMessage = {
  type: "log";
  message: string;
};

export type WorkerErrorMessage = {
  type: "error";
  message: string;
};

export type WorkerCompleteMessage = {
  type: "complete";
};
