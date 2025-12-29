import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlineCurrencyRupee } from 'react-icons/hi2'
import ChipInput from './ChipInput'
import Upload from '../Upload'
import RequirementsField from './RequirementsField'
import { MdNavigateNext } from 'react-icons/md'
// import { editCourse } from '../../../../../../server/controllers/Course'
// import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import IconBtn from '../../../../common/IconBtn'
import { useDispatch, useSelector } from 'react-redux'
import { setCourse, setStep } from '../../../../../slices/courseSlice'
import toast from 'react-hot-toast'
import { fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI'
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import { COURSE_STATUS } from "../../../../../utils/constants"
import { addCourseDetails } from '../../../../../services/operations/courseDetailsAPI'

const CourseInformationForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()



    const {token} = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [courseCategories, setCourseCategories] = useState([])
    const { course, editCourse } = useSelector((state) => state.course)
    const dispatch = useDispatch()


    const isFormUpdated = () =>{
        const currentValue= getValues()

        if(
            currentValue.courseTitle !== course.courseName ||
            currentValue.courseShortDesc !== course.courseDescription ||
            currentValue.coursePrice !== course.price ||
            currentValue.courseTags.toString() !== course.tag.toString() ||
            currentValue.courseBenefits !== course.whatYouWillLearn ||
            currentValue.courseCategory._id !== course.category._id ||
            currentValue.courseRequirements.toString() !== course.instructions.toString() ||
            currentValue.courseImage !== course.thumbnail
        ){
            return true
        }
        return false
    }


    useEffect(() => {
        const getCategories = async () => {
          setLoading(true)
          const categories = await fetchCourseCategories()
          if (categories.length > 0) {
            // console.log("categories", categories)
            setCourseCategories(categories)
          }
          setLoading(false)
        }
        // if form is in edit mode
        if (editCourse) {
          // console.log("data populated", editCourse)
          setValue("courseTitle", course.courseName)
          setValue("courseShortDesc", course.courseDescription)
          setValue("coursePrice", course.price)
          setValue("courseTags", course.tag)
          setValue("courseBenefits", course.whatYouWillLearn)
          setValue("courseCategory", course.category)
          setValue("courseRequirements", course.instructions)
          setValue("courseImage", course.thumbnail)
        }
        getCategories()
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    // handle next button click
    const onsubmit = async (data) =>{
        if(editCourse){
            if(isFormUpdated()){
                const currentValue=getValues()
                const formData= new FormData()

                formData.append("courseId", course._id)
                if (currentValue.courseTitle !== course.courseName) {
                formData.append("courseName", data.courseTitle)
                }
                if (currentValue.courseShortDesc !== course.courseDescription) {
                formData.append("courseDescription", data.courseShortDesc)
                }
                if (currentValue.coursePrice !== course.price) {
                formData.append("price", data.coursePrice)
                }
                if (currentValue.courseTags.toString() !== course.tag.toString()) {
                formData.append("tag", JSON.stringify(data.courseTags))
                }
                if (currentValue.courseBenefits !== course.whatYouWillLearn) {
                formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if (currentValue.courseCategory._id !== course.category._id) {
                formData.append("category", data.courseCategory)
                }
                if (
                currentValue.courseRequirements.toString() !==
                course.instructions.toString()
                ) {
                formData.append(
                    "instructions",
                    JSON.stringify(data.courseRequirements)
                )
                }
                if (currentValue.courseImage !== course.thumbnail) {
                formData.append("thumbnailImage", data.courseImage)
                }

                setLoading(true)
                const result = await  editCourseDetails(formData, token)
                setLoading(false)
                if(result){
                    dispatch(setStep(2))
                    dispatch(setCourse(result))
                }
                else{
                    toast.error("No change made to the form")
                }
                return
            }

            
        }
        const formData= new FormData()
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        setLoading(true)
        const result= await addCourseDetails(formData, token)
        if(result){
            dispatch(setStep(2))
            dispatch(setCourse(result))
        }
        setLoading(false)
            
    }

    
    

  return (
    <form 
        onSubmit={handleSubmit(onsubmit)}
    >
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Course Title <sup className="text-pink-200">*</sup>
            </label>
            <input
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: true })}
            className="form-style w-full"
            />
            {errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course title is required
            </span>
            )}
      </div>
        {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
                Course Short Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
                id="courseShortDesc"
                placeholder="Enter Description"
                {...register("courseShortDesc", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.courseShortDesc && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Course Description is required
                </span>
            )}
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="coursePrice">
                Course Price <sup className="text-pink-200">*</sup>
            </label>
            <div className="relative">
                <input
                    id="coursePrice"
                    placeholder="Enter Course Price"
                    {...register("coursePrice", {
                    required: true,
                    valueAsNumber: true,
                    pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    },
                    })}
                    className="form-style w-full !pl-12"
                />
                <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
            </div>
            {errors.coursePrice && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Course Price is required
                </span>
            )}
        </div>

        {/* Course Category */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseCategory">
                Course Category <sup className="text-pink-200">*</sup>
            </label>
            <select
                {...register("courseCategory", { required: true })}
                defaultValue=""
                id="courseCategory"
                className="form-style w-full"
            >
                {/* disabled makes this option not selectable by the user. */}
                {/* value="" means: “this option represents no category selected yet”. */}
                <option value="" disabled>  
                    Choose a Category
                </option>
                {!loading &&
                    courseCategories?.map((category, indx) => (
                    <option key={indx} value={category?._id}>
                        {category?.name}
                    </option>
                ))}
            </select>
            {errors.courseCategory && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Course Category is required
                </span>
            )}
      </div>

        {/* Course Tags */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        {/* Course Thumbnail Image */}
        <Upload
            name="courseImage"
            label="Course Thumbnail"
            register={register}
            setValue={setValue}
            errors={errors}
            editData={editCourse ? course?.thumbnail : null}
        />

        {/* Benefits of the course */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
                Benefits of the course <sup className="text-pink-200">*</sup>
            </label>
            <textarea
            id="courseBenefits"
            placeholder="Enter benefits of the course"
            {...register("courseBenefits", { required: true })}
            className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.courseBenefits && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Benefits of the course is required
                </span>
            )}
      </div>


      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />



      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}

export default CourseInformationForm