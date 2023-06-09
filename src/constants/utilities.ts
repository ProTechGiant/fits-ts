/* eslint-disable prettier/prettier */
import * as Images from "../constants/Images";

const selectStatusesData = [
  {
    id: 1,
    title: "Trainer",
    content: "A trainer account can create in person, virtual and pre-recorded classes as well as being able to book and attend sessions by other trainers.",
  },
  {
    id: 2,
    title: "Trainee",
    content: "A trainee can book and attend in person, virtual and pre-recorded classes.",
  },
];

const genderOptions: any = [
  { value: "Male", image: Images.Vector },
  { value: "Female", image: Images.Vector2 },
  { value: "Other", image: null },
];

export { genderOptions, selectStatusesData };
