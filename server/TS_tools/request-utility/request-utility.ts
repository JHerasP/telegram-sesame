import { Request } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";

export interface ExpressParams<T extends ParamsDictionary> extends Request {
  params: T;
}

export interface ExpressBody<T> extends Request {
  body: T;
}

export interface ExpressQuery<T extends Query> extends Request {
  query: T;
}

export type ExpressRequest<TParams extends ParamsDictionary, TBody, TQuery extends Query> = ExpressParams<TParams> &
  ExpressBody<TBody> &
  ExpressQuery<TQuery>;
