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

import { AiFillHome } from "react-icons/ai";
import { FormLabel, Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from "@clerk/nextjs";
import { DateTime } from "luxon";

interface MyIFormInput {
    id: string | number;
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
        name: string;
        lastName: string;
        statusAttempt: string;
        emailOrPhone: string;
        notes: string;
        type: string;
        streetNumber: string;
    }
}

const SimpleForm = ({ params }: { params: { id: string, streetId: string, name: string, lastName: string, statusAttempt: string, emailOrPhone: string, notes: string, type: string, streetNumber: string } }) => {
    const houseId = params.id;
    const streetId = params.streetId;
    const name = params.name;
    const lastName = params.lastName;
    const statusAttempt = params.statusAttempt;
    const emailOrPhone = params.emailOrPhone;
    const notes = params.notes;
    const type = params.type;
    const streetNumber = params.streetNumber;

    const { isLoaded, isSignedIn, user } = useUser();
    const shiftLoggerId = useState(user?.unsafeMetadata.ShiftLoggerId);

    const isClockedIn = user?.unsafeMetadata.isClockedIn

    if (!isClockedIn) {
        return (
            <div className="flex flex-col border p-6 ">
                <h1 className="text-black">You are not logged in</h1>
                <h2 className="text-gray-500">Please, log into account to update Property details</h2>
            </div>
        );
    }

    // create handlesubmit function from react-hook-form
    const { handleSubmit, control, formState: { errors } } = useForm<MyIFormInput>();

    const router = useRouter();




    const handleHouseStreetUpdate: SubmitHandler<MyIFormInput> = async (data: MyIFormInput) => {
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
        } catch (error) {
            console.error('There has been a problem with your fetch operation: ', error);
        }
    }


    const [siteId, setSiteId] = useState(user.unsafeMetadata.ShiftLoggerId);
    const [loggerData, setLoggerData] = useState({
        isActive: false,
        finishedDate: DateTime.now().toJSDate(),
    });
    const id = user.unsafeMetadata.id;
    const onSubmit: SubmitHandler<MyIFormInput> = async (data: MyIFormInput) => {
        data.lastUpdatedBy = user.fullName || "Unknown";
        data.lastUpdated = DateTime.now().toJSDate();
        setSiteId(user.unsafeMetadata.ShiftLoggerId);

        // if ({
        //     data.statusAttempt == 'consent final no'
        // })
        // data.isActive = true;
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

            setLoggerData({
                isActive: false,
                finishedDate: DateTime.now().toJSDate(),
            })


            const streetData = {
                lastVisited: DateTime.now().toJSDate(),
                lastVisitedby: user?.fullName
            }
            console.log(streetData);

            const streetResponse = await fetch(`https://hmsapi.herokuapp.com/streetsLastVisit/${streetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(streetData),
            });
            if (!streetResponse.ok) {
                throw new Error('Network response was not ok');
            }

            // await new Promise(resolve => setTimeout(resolve, 1000));

            const shift = await fetch(`https://hmsapi.herokuapp.com/updatedhouses/${shiftLoggerId}`, {
                method: 'PUT',

            });
            if (!shift.ok) {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error(error);
        }

        router.push(`/locations/streets/${streetId}`)
    };


    return (
        // <div className={styles.container}>
        <div className=''>
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
                                    <MenuItem value={"engineer visit required"}>engineer visit required</MenuItem>
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
