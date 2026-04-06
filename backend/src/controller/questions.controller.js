import { Question } from "../model/question.model.js";

const VALID_SHEETS = ['striver', 'lovebabbar', 'daily'];

const getQuestions = async (req, res) => {
    try {
        const { sheet, topic } = req.query;

        // Step 1: sheet param validate karo
        if (!sheet) {
            return res.status(400).json({ message: "sheet query param required (striver, lovebabbar, daily)" });
        }
        if (!VALID_SHEETS.includes(sheet)) {
            return res.status(400).json({ message: `Invalid sheet. Valid values: ${VALID_SHEETS.join(', ')}` });
        }

        // Step 2: filter object banao
        const filter = { sheet };
        if (topic) {
            filter.topic = topic;
        }

        // Step 3: DB se questions fetch karo, order se sort karo
        const questions = await Question.find(filter).sort({ order: 1 });

        // Step 4: Topic ke hisaab se group karo
        // { "Arrays": [...], "Strings": [...], ... }
        const grouped = {};
        for (const q of questions) {
            if (!grouped[q.topic]) {
                grouped[q.topic] = [];
            }
            grouped[q.topic].push(q);
        }

        return res.status(200).json(grouped);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { getQuestions };
