const Router = require("express");
const { subscribe, listSubscribers } = require("../controllers/newsletterController");

const router = Router();

router.post("/", subscribe);
router.get("/", listSubscribers);

module.exports = router;
