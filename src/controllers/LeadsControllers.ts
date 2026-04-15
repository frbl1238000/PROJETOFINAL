import { Handler } from "express";
import { prisma } from "../database/prismadatabase";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "../schema/Leadsrequesteschema";

import { HttpError } from "../errs/httpErro";

import { Prisma } from "../../generated/prisma/client";

export class LeadsControllers {
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);

      const {
        page = "1",
        name,
        status,
        pageSize = "10",
        sortBy = "name",
        order = "asc", // corrigido
      } = query;

      const pageSizeNunber = Number(pageSize);
      const pageNumber = Number(page);
      const where: Prisma.LeadWhereInput = {};

      if (name) where.name = { contains: name, mode: "insensitive" }; // corrigido
      if (status) where.status = status; // corrigido

      const Leads = await prisma.lead.findMany({
        where,
        skip: (pageNumber - 1) * pageSizeNunber,
        take: pageSizeNunber,
        orderBy: { [sortBy]: order === "desc" ? "desc" : "asc" }, // corrigido
      });

      const total = await prisma.lead.count({ where });

      res.status(200).json({
        data: Leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNunber,
          total,
          totalpages: Math.ceil(total / pageSizeNunber),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);

      const createLeads = await prisma.lead.create({
        data: body,
      });

      res.status(200).json(createLeads);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const LeadId = await prisma.lead.findUnique({
        where: { id },
        include: {
          groups: true,
          campaigns: true,
        },
      });

      if (!LeadId) throw new HttpError(400, "leads não encontrados");
      res.status(200).json(LeadId);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const leadExists = await prisma.lead.findUnique({
        where: { id },
      });
      if (!leadExists) throw new HttpError(404, "lead não encontrado");

      const body = UpdateLeadRequestSchema.parse(req.body);

      const updateLead = await prisma.lead.update({
        data: body,
        where: { id },
      });
      res.status(200).json(updateLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const leadExists = await prisma.lead.findUnique({ where: { id } });
      if (!leadExists) throw new HttpError(404, "lead não encontrado");

      const deletenew = await prisma.lead.delete({
        where: { id },
      });
      res.status(200).json(deletenew);
    } catch (error) {
      next(error);
    }
  };
}
