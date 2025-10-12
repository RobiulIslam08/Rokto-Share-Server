import z from "zod";

const loginUserValidationSchema = z.object({
	body:z.object({
		email:z.string().email('Invalid Email Address'),
		password:z.string(),
	})
})
