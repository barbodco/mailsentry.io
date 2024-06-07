export interface Response {
    data: Result[];
}

export interface Result {
    email:      string;
    reportId:   string;
    user:       string;
    deleted:    boolean;
    valid:      boolean;
    validators: Validators;
    reason:     string;
}

export interface Validators {
    regex:      CatchAll;
    typo:       CatchAll;
    disposable: CatchAll;
    mx:         CatchAll;
    duplicate:  CatchAll;
    role:       CatchAll;
    catchAll:   CatchAll;
    smtp:       CatchAll;
    full:       CatchAll;
    disabled:   CatchAll;
}

export interface CatchAll {
    valid: boolean;
}
