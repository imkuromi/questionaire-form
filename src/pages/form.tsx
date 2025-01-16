import * as React from "react";
import Grid from "@mui/material/Grid2";
import {
  Box,
  FormControlLabel,
  Button,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { SubmitHandler, useForm } from "react-hook-form";
import { Schema, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Questionnaire {
  name: string;
  question: Question[];
}

interface Question {
  //ใช้บ่อยสร้างแยก
  idQuestion: string;
  questionName: string;
  choice: {
    idChoice: number;
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
          idChoice: 1,
          isCorrect: true,
          description: "",
        },
        {
          idChoice: 2,
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
          idChoice: z.number(),
          isCorrect: z.boolean(),
          description: z.string().min(1, { message: "Please fill in this option" }),
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

  console.log(form, "form");

  
  const handleDescriptionTextChange = (
    questionId: string,
    choiceId: number,
    value: string
  ) => {
    const ques1 = form.question.map((q) => {
      const choice2 = q.choice.map((choice) => {
        console.log("choice :", choice);
        console.log("choice.idChoice  : ", choice.idChoice);
        console.log("choiceId : ", choiceId);
        console.log("index === choiceId", choice.idChoice === choiceId);
        return choice.idChoice === choiceId
          ? { ...choice, description: value }
          : choice;
      });
      return q.idQuestion === questionId
        ? {
            ...q,
            choice: choice2,
          }
        : q;
    });

    setForm({ ...form, question: ques1 });
  };
  // setForm({
  //   ...form,
  //   question: form.question.map((q) =>
  //     q.idQuestion === questionId
  //       ? {
  //           ...q,
  //           question: q.choice.map((choice, index) =>
  //             index === choiceId ?  ? { ...choice,
  //        description: value ,
  //       }
  //       : choice;
  //           ),
  //         }
  //       : q
  //   ),
  // });

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
        { idChoice: 1, isCorrect: true, description: "" },
        { idChoice: 2, isCorrect: false, description: "" },
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
                  idChoice: q.choice.length + 1,
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

  const handleChoiceChange = (idQuestion: string, choiceId: number) => {
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

  const deleteChoice = (idQuestion: string, idChoice: number) => {
    // setForm();
    const ques = form.question.map((q) => {
      const choice = q.choice.filter((q) => {
        // console.log(q.idChoice, 'q.idChoice')
        // console.log(idChoice, 'idChoice')
        // console.log(q.idChoice !== idChoice, 'q.idChoice !== idChoice')
        return q.idChoice !== idChoice;
      });
      // const choice = q.choice
      console.log(choice, "choice");
      return q.idQuestion === idQuestion
        ? {
            ...q,
            choice: choice,
          }
        : q;
    });
    setForm({ ...form, question: ques });
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
          onClick={() => {reset(initValue);setForm(initValue);}}
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
                      {...register(`question.${index}.choice.${indexC}.description`)}
                      error={!!errors.question?.[index]?.choice?.[indexC]?.description}
                      helperText={
                        (choice?.isCorrect === true )?'This answer is correct': errors.question?.[index]?.choice?.[indexC]?.description?.message
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
                      <DeleteOutlineIcon />
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
                  <AddIcon />
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
                  <ContentCopyIcon /> &nbsp; Duplicate
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
                  <DeleteOutlineIcon />
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
              <AddIcon /> &nbsp; add Question
            </Button>
          </Box>
        </Box>
      </Grid>
    </form>
  );
}
