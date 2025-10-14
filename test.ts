const getAllDonorFromDB = async (query:Reconr<string, unknown>) => {
 
	const donorSearchableFields = ['name', ' email']
	const donorQuery = new Qurebulder(
		UserProfiel.find({isAbaile:true})
		.populate({
			path:'user',
			select:'name, emai'
		})
	)
}