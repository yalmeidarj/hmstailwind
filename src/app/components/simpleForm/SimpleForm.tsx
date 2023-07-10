"use client"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Alert from '@mui/material/Alert';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import GoBack from "../GoBack";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { AiFillHome } from "react-icons/ai";
import { FormLabel, Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from "@clerk/nextjs";
import { DateTime } from "luxon";

interface MyIFormInput {
    type: string;
    lastName: string;
    name: string;
    statusAttempt: string;
    phoneOrEmail: string;
    notes: string;
    isActive: boolean;
    lastUpdated: Date;
    lastUpdatedBy: string;
}

interface ParamType {
    id: {
        house: string;
        street: string;
    }
}

const SimpleForm = ({ params }: { params: { id: string, streetId: string } }) => {
    const houseId = params.id;
    const streetId = params.streetId;

    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    // create handlesubmit function from react-hook-form
    const { handleSubmit, control, formState: { errors } } = useForm<MyIFormInput>();

    const router = useRouter();

    const onSubmit: SubmitHandler<MyIFormInput> = async (data: MyIFormInput) => {
        // const users = user.fullName || "Unknown";
        // const workerId = user?.unsafeMetadata.id as number

        data.lastUpdatedBy = user.fullName || "Unknown";
        data.lastUpdated = DateTime.now().toJSDate();
        data.isActive = true;
        try {
            const response = await fetch(`https://hmsapi.herokuapp.com/houses/${houseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                console.log(response);
                throw new Error('Network response was not ok');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));

            const shiftLoggerResponse = await fetch(`https://hmsapi.herokuapp.com/shiftLogger/${user.id}`, {
                method: 'PUT',
            }
            );
            if (!shiftLoggerResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const streetResponse = await fetch(`https://hmsapi.herokuapp.com/streetsLastVisit/${streetId}`, {
                method: 'PUT',
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            const userResponse = await fetch(`https://hmsapi.herokuapp.com/usersLastVisit/${user.id}`, {
                method: 'PUT',
            });
            if (!streetResponse.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation: ', error);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push(`/locations/streets/${streetId}`)
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* <FormLabel id="demo-radio-buttons-group-label">Construction difficulty</FormLabel> */}
                        {/* Construction type */}
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup {...field}
                                    sx={{
                                        color: "#000",
                                    }}
                                    row>
                                    <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                                    <FormControlLabel value="Moderate" control={<Radio />} label="Moderate" />
                                    <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                                </RadioGroup>
                            )}
                        />
                        {errors.type && <Alert severity="error">{errors.type.message}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="statusAttempt"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
                                    onChange={(e) => field.onChange(e.target.value)} // Add onChange event handler
                                >
                                    <MenuItem value={"1st attempt"}>1st Attempt</MenuItem>
                                    <MenuItem value={"2nd attempt"}>2nd Attempt</MenuItem>
                                    <MenuItem value={"3rd attempt"}>3rd Attempt</MenuItem>
                                    <MenuItem value={"4th attempt"}>4th Attempt</MenuItem>
                                    <MenuItem value={"5th attempt"}>5th Attempt</MenuItem>
                                    <MenuItem value={"engineer visit required"}>Engineer visit required</MenuItem>
                                    <MenuItem value={"consent final yes"}>consent final yes</MenuItem>
                                    <MenuItem value={"consent final no"}>consent final no</MenuItem>
                                    <MenuItem value={"drop type unverified"}>drop type unverified</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.statusAttempt && <Alert severity="error">{errors.statusAttempt.message}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Last Name" fullWidth />}
                        />
                        {errors.lastName && <Alert severity="error">{errors.lastName.message}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Name" fullWidth />}
                        />
                        {errors.name && <Alert severity="error">{errors.name.message}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="phoneOrEmail"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Email" fullWidth />}
                        />
                        {errors.phoneOrEmail && <Alert severity="error">{errors.phoneOrEmail.message}</Alert>}
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Notes" fullWidth multiline />}
                        />
                        {errors.notes && <Alert severity="error">{errors.notes.message}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <GoBack text='Previous' />
                    </Grid>
                    <Grid
                        item
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                        xs={6}>
                        <Button
                            sx={{
                                borderRadius: 1,
                                borderColor: "#fff",
                                fontSize: 14,
                                padding: "10px 20px",
                            }}
                            onClick={handleSubmit(onSubmit)}
                            type="submit" variant="contained" >
                            UPDATE DETAILS
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>

    );
};
export default SimpleForm;
