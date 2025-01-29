import React, { useState } from "react";
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
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Questionnaire {
  name: string;
  questions: Question[];
}

interface Question {
  idQuestion: string;
  questionName: string;
  choices: {
    idChoice: string;
    isCorrect: boolean;
    description: string;
  }[];
}

const initValue: Questionnaire = {
  name: "",
  questions: [
    {
      idQuestion: uuid(),
      questionName: "",
      choices: [
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
  questions: z.array(
    z.object({
      idQuestion: z.string(),
      questionName: z
        .string()
        .min(1, { message: "Please fill in this option" }),
      choices: z.array(
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
    control,
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
  ) => {
    const question = form.questions.map((q) => {
      const choice = q.choices.map((choice) => {
        return choice.idChoice === choiceId
          ? { ...choice, description: value }
          : choice;
      });
      return q.idQuestion === questionId
        ? {
            ...q,
            choices: choice,
          }
        : q;
    });
    setForm({ ...form, questions: question });
  };

  const handleQuestionTextChange = (questionId: string, value: string) => {
    const question = form.questions.map((q) => {
      return q.idQuestion === questionId ? { ...q, questionName: value } : q;
    });
    console.log();

    setForm({ ...form, questions: question });
  };

  const copyQuestion = (questionId: string) => {
    const copiedQuestion = {
      ...form.questions.find((q) => q.idQuestion === questionId),
    } as Question;

    copiedQuestion.idQuestion = uuid();

    setForm({ ...form, questions: [...form.questions, copiedQuestion] });
  };

  const addQuestion = () => {
    const newQuestion = {
      idQuestion: uuid(),
      questionName: "",
      choices: [
        { idChoice: uuid(), isCorrect: true, description: "" },
        { idChoice: uuid(), isCorrect: false, description: "" },
      ],
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  const addChoice = (idQuestion: string) => {
    const question = form.questions.map((q) => {
      return q.idQuestion === idQuestion
        ? {
            ...q,
            choices: [
              ...q.choices,
              {
                idChoice: uuid(),
                isCorrect: false,
                description: "",
              },
            ],
          }
        : q;
    });
    setForm({ ...form, questions: question });
  };

  const deleteQuestion = (idQuestion: string) => {
    const question = form.questions.filter((q) => q.idQuestion !== idQuestion);

    setForm({
      ...form,
      questions: question,
    });
  };

  const handleChoiceChange = (idQuestion: string, choiceId: string) => {
    const question = form.questions.map((q) =>
      q.idQuestion === idQuestion
        ? {
            ...q,
            choices: q.choices.map((c) => ({
              ...c,
              isCorrect: c.idChoice === choiceId,
            })),
          }
        : q
    );
    setForm({ ...form, questions: question });
  };

  const deleteChoice = (idQuestion: string, idChoice: string) => {
    const question = form.questions.map((q) => {
      if (q.idQuestion === idQuestion) {
        const choice = q.choices.filter((q) => q.idChoice !== idChoice);
        if (!choice.some((x) => x.isCorrect) && choice.length > 0) {
          choice[0].isCorrect = true;
        }
        return { ...q, choices: choice };
      }
      return q;
    });

    setForm({ ...form, questions: question });
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
              helperText={form?.name === "" ? errors.name?.message : ""}
              label="Name"
              value={form?.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Box>

          {form.questions.map((question, index) => (
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
              <Controller
                control={control}
                name={`questions.${index}.questionName`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    error={
                      !!errors.questions?.[index]?.questionName &&
                      question.questionName === ""
                    }
                    helperText={
                      question.questionName === ""
                        ? errors.questions?.[index]?.questionName?.message
                        : ""
                    }
                    label="Question"
                    value={question.questionName}
                    onChange={(e) =>
                      handleQuestionTextChange(
                        question.idQuestion,
                        e.target.value
                      )
                    }
                  />
                )}
              />

              {question.choices.map((choice, indexC: number) => (
                <Grid
                  container
                  justifyContent={"start"}
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
                    <Controller
                      control={control}
                      name={`questions.${index}.choices.${indexC}.description`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          error={
                            !!errors.questions?.[index]?.choices?.[indexC]
                              ?.description && choice.description === ""
                          }
                          helperText={
                            choice?.isCorrect === true
                              ? "This answer is correct"
                              : choice.description === ""
                              ? errors.questions?.[index]?.choices?.[indexC]
                                  ?.description?.message
                              : ""
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
                      )}
                    />
                  </Grid>
                  {question.choices.length > 1 && (
                    <Grid size={1}>
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
                  )}
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
