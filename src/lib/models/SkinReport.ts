import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDetectedIssue {
  name: string;
  severity: "Low" | "Moderate" | "Severe";
  confidence: number;
}

export interface IProduct {
  name: string;
  brand: string;
  type: string;
  activeIngredients: string[];
  usage: string;
}

export interface IRecommendations {
  morningRoutine: string[];
  nightRoutine: string[];
  dietSuggestions: string[];
  waterIntakeSuggestion: string;
  sleepSuggestion: string;
  products: {
    budget: IProduct[];
    premium: IProduct[];
    dermatologist: IProduct[];
  };
}

export interface ISkinReport extends Document {
  userEmail: string;
  patientDetails: {
    name: string;
    age: number;
    gender: string;
  };
  questionnaire: {
    skinType: string;
    problemDuration: string;
    primaryConcerns: string[];
    lifestyle: {
      waterIntake: string;
      sleepDuration: string;
      stressLevel: string;
      smokingOrAlcohol: string;
      dailyScreenTime: string;
      foodHabits: string;
    };
    medicalBackground: {
      pregnancy: string;
      hormonalImbalance: string;
      pcos: string;
      diabetes: string;
      thyroid: string;
      skinAllergies: string;
      currentMedications: string;
      familySkinDiseaseHistory: string;
    };
    hairAndScalp: {
      dandruff: string;
      hairThinning: string;
      hairFallSeverity: string;
      scalpItching: string;
    };
  };
  imageUrl?: string;
  scores: {
    skinHealthScore: number;
    hydrationScore: number;
    acneScore: number;
    glowScore: number;
    sensitivityScore: number;
  };
  diagnostics: {
    detectedIssues: IDetectedIssue[];
    skinAgeEstimation: number;
    confidencePercentage: number;
  };
  recommendations: IRecommendations;
  medicinesAndPrecautions: {
    possibleHelpfulMedicines: string[];
    precautions: string[];
    foodsToAvoid: string[];
    lifestyleImprovements: string[];
    hygieneRecommendations: string[];
  };
  security: {
    encryptedStorage: boolean;
    autoDeleteSelected: boolean;
    consentChecked: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  activeIngredients: [{ type: String }],
  usage: { type: String, required: true },
});

const SkinReportSchema: Schema<ISkinReport> = new Schema(
  {
    userEmail: { type: String, required: true },
    patientDetails: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
    },
    questionnaire: {
      skinType: { type: String, required: true },
      problemDuration: { type: String, required: true },
      primaryConcerns: [{ type: String }],
      lifestyle: {
        waterIntake: { type: String },
        sleepDuration: { type: String },
        stressLevel: { type: String },
        smokingOrAlcohol: { type: String },
        dailyScreenTime: { type: String },
        foodHabits: { type: String },
      },
      medicalBackground: {
        pregnancy: { type: String },
        hormonalImbalance: { type: String },
        pcos: { type: String },
        diabetes: { type: String },
        thyroid: { type: String },
        skinAllergies: { type: String },
        currentMedications: { type: String },
        familySkinDiseaseHistory: { type: String },
      },
      hairAndScalp: {
        dandruff: { type: String },
        hairThinning: { type: String },
        hairFallSeverity: { type: String },
        scalpItching: { type: String },
      },
    },
    imageUrl: { type: String },
    scores: {
      skinHealthScore: { type: Number, required: true },
      hydrationScore: { type: Number, required: true },
      acneScore: { type: Number, required: true },
      glowScore: { type: Number, required: true },
      sensitivityScore: { type: Number, required: true },
    },
    diagnostics: {
      detectedIssues: [
        {
          name: { type: String },
          severity: { type: String, enum: ["Low", "Moderate", "Severe"] },
          confidence: { type: Number },
        },
      ],
      skinAgeEstimation: { type: Number, required: true },
      confidencePercentage: { type: Number, required: true },
    },
    recommendations: {
      morningRoutine: [{ type: String }],
      nightRoutine: [{ type: String }],
      dietSuggestions: [{ type: String }],
      waterIntakeSuggestion: { type: String },
      sleepSuggestion: { type: String },
      products: {
        budget: [ProductSchema],
        premium: [ProductSchema],
        dermatologist: [ProductSchema],
      },
    },
    medicinesAndPrecautions: {
      possibleHelpfulMedicines: [{ type: String }],
      precautions: [{ type: String }],
      foodsToAvoid: [{ type: String }],
      lifestyleImprovements: [{ type: String }],
      hygieneRecommendations: [{ type: String }],
    },
    security: {
      encryptedStorage: { type: Boolean, default: true },
      autoDeleteSelected: { type: Boolean, default: false },
      consentChecked: { type: Boolean, required: true },
    },
  },
  { timestamps: true }
);

const SkinReport: Model<ISkinReport> =
  mongoose.models.SkinReport || mongoose.model<ISkinReport>("SkinReport", SkinReportSchema);
export default SkinReport;
