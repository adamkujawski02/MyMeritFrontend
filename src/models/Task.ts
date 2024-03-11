import Company from "./Company";

class Task {
    constructor(
        public id: string,
        public topic: string,
        public description: string,
        public releaseDate: Date,
        public expiryDate: Date,
        public rewards: number,
        public company: Company,
        public solutionCount: number,
        public allowedTechnologies: string[]
    ) {}
}

export default Task;