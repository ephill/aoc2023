export const logJson = (obj: any) => {
  console.log(JSON.stringify(obj, undefined, 2));
};

export const log = (obj: any) => {
  console.log(obj);
};

export const logDateTime = (date: number | Date | undefined) => {
  log(
    Intl.DateTimeFormat("en", {
      dateStyle: "short",
      timeStyle: "long",
    }).format(Date.now())
  );
};
