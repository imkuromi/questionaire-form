import React,{useState} from "react";
import Grid from "@mui/material/Grid2";
import {
  Box,
  FormControlLabel,
  Button,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutline, Add, ContentCopy } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Questionnaire {
  name: string;
  question: Question[];
}

interface Question {
  idQuestion: string;
  questionName: string;
  choice: {
    idChoice: string;
    isCorrect: boolean;
    description: string;
  }[];
}

const initValue: Questionnaire = {
  name: "",
  question: [
    {
      idQuestion: uuid(),
      questionName: "",
      choice: [
        {
          idChoice: uuid(),
          isCorrect: true,
          description: "",
        },
        {
          idChoice: uuid(),
          isCorrect: false,
          description: "",
        },
      ],
    },
  ],
};

const schema = z.object({
  name: z.string().min(1, { message: "Please fill in this option" }),
  question: z.array(
    z.object({
      idQuestion: z.number(),
      questionName: z
        .string()
        .min(1, { message: "Please fill in this option" }),
      choice: z.array(
        z.object({
          idChoice: z.string(),
          isCorrect: z.boolean(),
          description: z
            .string()
            .min(1, { message: "Please fill in this option" }),
        })
      ),
    })
  ),
});

export default function Form() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Questionnaire>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: initValue,
  });

  const onSubmit: SubmitHandler<Questionnaire> = (data) =>
    console.log("data", data);

  const [form, setForm] = useState<Questionnaire>(initValue);

  const handleDescriptionTextChange = (
    questionId: string,
    choiceId: string,
    value: string
  ) =>
    setForm({
      ...form,
      question: form.question.map((q) =>
        q.idQuestion === questionId
          ? {
              ...q,
              choice: q.choice.map((choice) =>
                choice.idChoice === choiceId
                  ? { ...choice, description: value }
                  : choice
              ),
            }
          : q
      ),
    });

  const handleQuestionTextChange = (questionId: string, value: string) => {
    setForm({
      ...form,
      question: form.question.map((q) =>
        q.idQuestion === questionId ? { ...q, questionName: value } : q
      ),
    });
  };

  const copyQuestion = (questionId: string) => {
    const copiedQuestion = {
      ...form.question.find((q) => q.idQuestion === questionId),
    } as Question;

    copiedQuestion.idQuestion = uuid();

    setForm({ ...form, question: [...form.question, copiedQuestion] });
  };

  const addQuestion = () => {
    const newQuestion = {
      idQuestion: uuid(),
      questionName: "",
      choice: [
        { idChoice: uuid(), isCorrect: true, description: "" },
        { idChoice: uuid(), isCorrect: false, description: "" },
      ],
    };
    setForm({
      ...form,
      question: [...form.question, newQuestion],
    });
  };

  const addChoice = (idQuestion: string) => {
    setForm({
      ...form,
      question: form.question.map((q) =>
        q.idQuestion === idQuestion
          ? {
              ...q,
              choice: [
                ...q.choice,
                {
                  idChoice: String(q.choice.length + 1),
                  isCorrect: false,
                  description: "",
                },
              ],
            }
          : q
      ),
    });
  };

  const deleteQuestion = (idQuestion: string) => {
    setForm({
      ...form,
      question: form.question.filter((q) => q.idQuestion !== idQuestion),
    });
  };

  const handleChoiceChange = (idQuestion: string, choiceId: string) => {
    setForm({
      ...form,
      question: form.question.map((q) =>
        q.idQuestion === idQuestion
          ? {
              ...q,
              choice: q.choice.map((choice) => ({
                ...choice,
                isCorrect: choice.idChoice === choiceId,
              })),
            }
          : q
      ),
    });
  };

  const deleteChoice = (idQuestion: string, idChoice: string) => {
    setForm({
      ...form,
      question: form.question.map((q) =>
        q.idQuestion === idQuestion
          ? {
              ...q,
              choice: q.choice.filter((q) => q.idChoice !== idChoice),
            }
          : q
      ),
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        justifyContent={"end"}
        size={{ sm: 12, md: 12, lg: 12 }}
        sx={{ paddingY: "1rem" }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            reset(initValue);
            setForm(initValue);
          }}
          sx={{
            borderColor: "#FF5C00",
            color: "#FF5C00",
            marginRight: "0.5rem",
          }}
        >
          cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#FF5C00",
            paddingX: "4rem",
            marginRight: "0.5rem",
          }}
        >
          save
        </Button>
      </Grid>
      <Grid
        container
        justifyContent={"start"}
        size={{ sm: 12, md: 12, lg: 12 }}
        sx={{ backgroundColor: "grey.100", padding: "1rem" }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFF",
            borderRadius: "0.5rem",
          }}
        >
          <Box
            sx={{ padding: "1rem", borderBottom: 0.5, borderColor: "grey.300" }}
          >
            <Typography
              sx={{ marginBottom: "0.5rem", paddingBottom: "0.5rem" }}
            >
              Questionnaire Detail
            </Typography>
            <TextField
              fullWidth
              required
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              label="Name"
              value={form?.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Box>

          {form.question.map((question, index) => (
            <Box
              key={question.idQuestion}
              sx={{
                padding: "1rem",
                borderBottom: 0.5,
                borderColor: "grey.300",
              }}
            >
              <Typography
                sx={{ marginBottom: "0.5rem", paddingBottom: "0.5rem" }}
              >
                Question {index + 1}
              </Typography>
              <TextField
                fullWidth
                required
                {...register(`question.${index}.questionName`)}
                error={!!errors.question?.[index]?.questionName}
                helperText={errors.question?.[index]?.questionName?.message}
                label="Question"
                value={question.questionName}
                onChange={(e) =>
                  handleQuestionTextChange(question.idQuestion, e.target.value)
                }
              />
              {question.choice.map((choice, indexC: number) => (
                <Grid
                  container
                  justifyContent={"center"}
                  alignContent={"center"}
                  marginTop={"1rem"}
                  size={12}
                  key={choice.idChoice}
                >
                  <Grid
                    container
                    justifyContent={"center"}
                    alignContent={"center"}
                    size={1}
                  >
                    <FormControlLabel
                      checked={choice.isCorrect}
                      color="success"
                      control={<Radio />}
                      name="isCorrect"
                      label=""
                      onChange={() =>
                        handleChoiceChange(question.idQuestion, choice.idChoice)
                      }
                    />
                  </Grid>

                  <Grid size={10}>
                    <TextField
                      fullWidth
                      required
                      {...register(
                        `question.${index}.choice.${indexC}.description`
                      )}
                      error={
                        !!errors.question?.[index]?.choice?.[indexC]
                          ?.description &&
                        !(choice.isCorrect && !choice.description)
                      }
                      helperText={
                        choice?.isCorrect === true && !choice?.description
                          ? "This answer is correct"
                          : errors.question?.[index]?.choice?.[indexC]
                              ?.description?.message
                      }
                      label="Description"
                      value={choice.description}
                      onChange={(e) =>
                        handleDescriptionTextChange(
                          question.idQuestion,
                          choice.idChoice,
                          e.target.value
                        )
                      }
                    />
                  </Grid>

                  <Grid
                    container
                    justifyContent={"center"}
                    alignContent={"center"}
                    size={1}
                  >
                    <Button
                      onClick={() =>
                        deleteChoice(question.idQuestion, choice.idChoice)
                      }
                      sx={{
                        color: "#000",
                        marginLeft: "1.7rem",
                        marginY: "0.5rem",
                        gap: 2,
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    >
                      <DeleteOutline />
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Box sx={{ borderBottom: 0.5, borderColor: "grey.300" }}>
                <Button
                  onClick={() => addChoice(question.idQuestion)}
                  sx={{
                    color: "#FF5C00",
                    marginLeft: "1.7rem",
                    marginY: "0.5rem",
                    gap: 2,
                  }}
                >
                  <Add />
                  <Typography>add choice</Typography>
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1rem",
                }}
              >
                <Button
                  sx={{
                    color: "#000",
                    marginLeft: "1.7rem",
                    "&:hover": {
                      color: "green",
                    },
                  }}
                  onClick={() => copyQuestion(question.idQuestion)}
                >
                  <ContentCopy /> &nbsp; Duplicate
                </Button>
                <Button
                  onClick={() => deleteQuestion(question.idQuestion)}
                  sx={{
                    color: "#000",
                    marginLeft: "1.7rem",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                >
                  <DeleteOutline />
                  &nbsp; Delete
                </Button>
              </Box>
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingRight: "1rem",
              marginY: "1rem",
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={() => addQuestion()}
              sx={{
                borderColor: "#FF5C00",
                color: "#FF5C00",
                marginLeft: "1.7rem",
              }}
            >
              <Add /> &nbsp; add Question
            </Button>
          </Box>
        </Box>
      </Grid>
    </form>
  );
}
