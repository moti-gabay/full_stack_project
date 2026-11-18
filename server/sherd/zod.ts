
import { z } from 'zod';


const age = z.number().int().min(0).max(120);


console.log(age.parse(30));
