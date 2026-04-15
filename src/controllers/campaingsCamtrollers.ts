import { Handler } from "express";
import { campaingschema } from "../schema/campainsShema";
import { prisma } from "../database/prismadatabase";
import { HttpError } from "../errs/httpErro";

export class CampaignControllers {
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany();
      res.status(200).json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const data = campaingschema.parse(req.body);

      const campaign = await prisma.campaign.create({
        data,
      });

      res.status(201).json(campaign); // melhor prática
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpError(400, "ID inválido");

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { leads: true },
      });

      if (!campaign) {
        throw new HttpError(404, "Campanha não encontrada");
      }

      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpError(400, "ID inválido");

      await prisma.campaign.delete({
        where: { id },
      });

      res.status(204).send(); // sem conteúdo
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpError(400, "ID inválido");

      const data = campaingschema.parse(req.body); // corrigido

      const campaign = await prisma.campaign.update({
        where: { id },
        data,
      });

      res.status(200).json(campaign);
    } catch (error) {
      next(error);
    }
  };
}
