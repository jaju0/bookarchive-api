import mongoose from "mongoose";

export interface IPublisher extends mongoose.Document
{
    name: string;
    address?: string;
    website?: string;
}

type PublisherModel = mongoose.Model<IPublisher>;

const publisherSchema = new mongoose.Schema<IPublisher, PublisherModel>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: false,
        trim: true,
    },
    website: {
        type: String,
        required: false,
        trim: true,
    },
});

publisherSchema.set("timestamps", true);

export const Publisher = mongoose.model("Publisher", publisherSchema);
export type Publisher = InstanceType<typeof Publisher>;