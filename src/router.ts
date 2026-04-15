import Express from "express";
import { LeadsControllers } from "./controllers/LeadsControllers";
import { CampaignControllers } from "./controllers/campaingsCamtrollers";

const leadsControllers = new LeadsControllers();
const campaigncomtrollers = new CampaignControllers();

const router = Express.Router();

router.get("/leads", leadsControllers.index);
router.post("/CreateLeads", leadsControllers.create);
router.get("/leads/:id", leadsControllers.show);
router.put("/update/:id", leadsControllers.update);
router.delete("/delete/:id", leadsControllers.delete);

//rotas campaings
router.get("/campaigns", campaigncomtrollers.index);
router.post("/campaigns", campaigncomtrollers.create);
router.get("/campaigns/:id", campaigncomtrollers.show);
router.put("/campaigns/:id", campaigncomtrollers.update);
router.delete("/campaigns/:id", campaigncomtrollers.delete);
export default router;
