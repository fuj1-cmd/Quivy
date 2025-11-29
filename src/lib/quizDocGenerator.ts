/**
 * Quiz DOCX Generator - Creates formatted Word documents for quizzes
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  difficulty: string;
  questionType: string;
  questions: QuizQuestion[];
}

/**
 * Generate and download a formatted quiz document (without answers)
 */
export async function downloadQuizDocument(quiz: Quiz): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: quiz.title,
            heading: HeadingLevel.HEADING_1,
            spacing: {
              after: 200,
            },
          }),

          // Quiz Info
          new Paragraph({
            spacing: {
              after: 300,
            },
            children: [
              new TextRun({
                text: `${quiz.questions.length} Questions - ${quiz.questionType === "mcq" ? "Multiple Choice" : "True/False"}`,
                size: 20,
              }),
            ],
          }),

          // Questions
          ...quiz.questions.flatMap((question, index) => [
            // Question number and text
            new Paragraph({
              spacing: {
                before: 250,
                after: 150,
              },
              children: [
                new TextRun({
                  text: `${index + 1}. `,
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: question.question,
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            // Options
            ...question.options.map((option, optIndex) => {
              const letter = String.fromCharCode(65 + optIndex);
              return new Paragraph({
                spacing: {
                  before: 80,
                  after: 80,
                },
                indent: {
                  left: 360,
                },
                children: [
                  new TextRun({
                    text: `${letter}. ${option}`,
                    size: 20,
                  }),
                ],
              });
            }),
          ]),
        ],
      },
    ],
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${quiz.title.replace(/[^a-z0-9]/gi, "_")}.docx`);
}

/**
 * Generate and download a formatted answer key document
 */
export async function downloadAnswerKeyDocument(quiz: Quiz): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: `${quiz.title} - Answer Key`,
            heading: HeadingLevel.HEADING_1,
            spacing: {
              after: 200,
            },
          }),

          // Quiz Info
          new Paragraph({
            spacing: {
              after: 300,
            },
            children: [
              new TextRun({
                text: `${quiz.questions.length} Questions - ${quiz.questionType === "mcq" ? "Multiple Choice" : "True/False"}`,
                size: 20,
              }),
            ],
          }),

          // Questions with answers
          ...quiz.questions.flatMap((question, index) => {
            const correctLetter = String.fromCharCode(65 + question.correctAnswer);
            const correctOption = question.options[question.correctAnswer];

            return [
              // Question number and text
              new Paragraph({
                spacing: {
                  before: 250,
                  after: 150,
                },
                children: [
                  new TextRun({
                    text: `${index + 1}. `,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: question.question,
                    bold: true,
                    size: 24,
                  }),
                ],
              }),

              // Correct answer
              new Paragraph({
                spacing: {
                  before: 100,
                  after: question.explanation ? 100 : 200,
                },
                indent: {
                  left: 360,
                },
                children: [
                  new TextRun({
                    text: `Answer: ${correctLetter}. ${correctOption}`,
                    bold: true,
                    size: 20,
                  }),
                ],
              }),

              // Explanation (if available)
              ...(question.explanation
                ? [
                    new Paragraph({
                      spacing: {
                        after: 200,
                      },
                      indent: {
                        left: 360,
                      },
                      children: [
                        new TextRun({
                          text: question.explanation,
                          italics: true,
                          size: 18,
                        }),
                      ],
                    }),
                  ]
                : []),
            ];
          }),
        ],
      },
    ],
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${quiz.title.replace(/[^a-z0-9]/gi, "_")}_Answer_Key.docx`);
}
