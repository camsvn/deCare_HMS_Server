import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import Locals from "../../providers/Locals";
import Log from "../../middlewares/Log";
import {
  errorResponse,
  failResponse,
  successResponse,
} from "../../helpers/JSend";

import { mainDB } from "../../providers/Database";

export const getOPRegisterController = async (req: Request, res: Response) => {
  try {
    let opid = Number(req.query.opid);

    if (!opid) {
      return res.status(400).json(failResponse("Invalid opid"));
    }

    const patient = await mainDB.OpRegisters.findOne({
      where: { opid },
    });

    if (patient) {
      return res.status(200).json(successResponse(patient));
    }
    res.status(404).json(failResponse("Invalid OP Number"));
  } catch (e: any) {
    Log.error(e.message);
    res.status(500).json(errorResponse("Internal Server Error", e.message));
  }
};
