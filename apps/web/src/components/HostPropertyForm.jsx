import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { FormFieldWrapper } from '@/components/FormFieldWrapper.jsx';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext.jsx';
import api from '@/lib/api.js';


const HostPropertyForm = ({
  property = null,
  onClose,
  onSuccess
}) => {

  const { currentUser } = useAuth();

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      title: property?.title || '',

      description:
        property?.description || '',

      location:
        property?.location ||
        property?.city ||
        '',

      propertyType:
        property?.propertyType || 'Villas',

      pricePerNight:
        property?.pricePerNight ||
        property?.price ||
        '',

      bedrooms:
        property?.bedrooms || '',

      bathrooms:
        property?.bathrooms || '',

      guestCapacity:
        property?.guestCapacity ||
        property?.maxGuests ||
        '',

      houseRules:
        property?.houseRules || ''
    }
  });


  const propertyType =
    watch('propertyType');


  /* =====================================================
     SUBMIT PROPERTY
  ===================================================== */

  const onSubmit = async (data) => {

    if (isSubmitting) return;


    /* -----------------------------
       CHECK LOGIN
    ----------------------------- */

    if (!currentUser?.id) {

      console.error(
        'No authenticated user found:',
        currentUser
      );

      toast.error(
        'Please login again before adding a property.'
      );

      return;
    }


    setIsSubmitting(true);


    try {

      /* -----------------------------
         PREPARE DATA FOR BACKEND
      ----------------------------- */

      const location =
        data.location?.trim() || '';


      const payload = {

        /* HOST */

        hostId:
          currentUser.id,


        /* BASIC DETAILS */

        title:
          data.title.trim(),

        description:
          data.description.trim(),

        propertyType:
          data.propertyType,


        /* LOCATION */

        city:
          location,

        address:
          location,

        country:
          'India',


        /* PROPERTY DETAILS */

        pricePerNight:
          Number(data.pricePerNight),

        bedrooms:
          Number(data.bedrooms),

        bathrooms:
          Number(data.bathrooms),

        maxGuests:
          Number(data.guestCapacity),

        beds:
          0,


        /* RULES */

        houseRules:
          data.houseRules?.trim() || ''
      };


      console.log(
        'SUBMITTING PROPERTY:',
        payload
      );


      let result;


      /* -----------------------------
         UPDATE PROPERTY
      ----------------------------- */

      if (property?.id || property?._id) {

        const propertyId =
          property.id || property._id;


        result = await api.put(
          `/properties/${propertyId}`,
          payload
        );


        console.log(
          'PROPERTY UPDATED:',
          result.data
        );


        toast.success(
          'Property updated successfully'
        );

      }


      /* -----------------------------
         CREATE PROPERTY
      ----------------------------- */

      else {

        result = await api.post(
          '/properties',
          payload
        );


        console.log(
          'PROPERTY CREATED:',
          result.data
        );


        toast.success(
          'Property submitted successfully for admin approval'
        );
      }


      /* -----------------------------
         SUCCESS CALLBACK
      ----------------------------- */

      if (onSuccess) {

        onSuccess(
          result?.data?.property ||
          result?.data
        );
      }


    } catch (error) {

      console.error(
        'PROPERTY SUBMIT ERROR:',
        error
      );

      console.error(
        'BACKEND RESPONSE:',
        error?.response?.data
      );


      const message =

        error?.response?.data?.message ||

        error?.message ||

        'Failed to submit property';


      toast.error(message);


    } finally {

      setIsSubmitting(false);

    }

  };


  return (

    <div
      className="
        bg-card
        rounded-2xl
        border
        border-border
        shadow-lg
        max-h-[85vh]
        flex
        flex-col
        overflow-hidden
      "
    >


      {/* =========================================
          HEADER
      ========================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          p-6
          border-b
          border-border
          bg-muted/10
        "
      >

        <h2
          className="
            text-xl
            font-bold
            text-foreground
          "
        >

          {property
            ? 'Edit Property'
            : 'Add New Property'
          }

        </h2>


        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >

          <X
            className="
              w-5
              h-5
              text-muted-foreground
            "
          />

        </Button>

      </div>



      {/* =========================================
          FORM
      ========================================= */}

      <div
        className="
          p-6
          overflow-y-auto
          custom-scrollbar
          flex-1
        "
      >

        <form
          id="property-form"

          onSubmit={
            handleSubmit(onSubmit)
          }

          className="space-y-6"
        >


          {/* TITLE + LOCATION */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            <FormFieldWrapper
              label="Property Title"
              required
              error={
                errors.title?.message
              }
            >

              <Input

                placeholder="
                  E.g., Luxury Sea View Villa
                "

                className="
                  text-foreground
                "

                {...register(
                  'title',
                  {
                    required:
                      'Title is required'
                  }
                )}

              />

            </FormFieldWrapper>



            <FormFieldWrapper
              label="Location / City"
              required
              error={
                errors.location?.message
              }
            >

              <Input

                placeholder="
                  E.g., Dehradun
                "

                className="
                  text-foreground
                "

                {...register(
                  'location',
                  {
                    required:
                      'Location is required'
                  }
                )}

              />

            </FormFieldWrapper>

          </div>



          {/* DESCRIPTION */}

          <FormFieldWrapper
            label="Description"
            required
            error={
              errors.description?.message
            }
          >

            <Textarea

              placeholder="
                Describe your property...
              "

              className="
                min-h-[120px]
                text-foreground
              "

              {...register(
                'description',
                {
                  required:
                    'Description is required'
                }
              )}

            />

          </FormFieldWrapper>



          {/* PROPERTY TYPE + PRICE */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            <FormFieldWrapper
              label="Property Type"
              required
            >

              <Select

                value={propertyType}

                onValueChange={(val) =>

                  setValue(
                    'propertyType',
                    val,
                    {
                      shouldValidate:
                        true
                    }
                  )

                }

              >

                <SelectTrigger
                  className="
                    text-foreground
                  "
                >

                  <SelectValue
                    placeholder="
                      Select type
                    "
                  />

                </SelectTrigger>


                <SelectContent>

                  <SelectItem
                    value="Villas"
                  >
                    Villa
                  </SelectItem>


                  <SelectItem
                    value="Hotels"
                  >
                    Hotel
                  </SelectItem>


                  <SelectItem
                    value="Apartments"
                  >
                    Apartment
                  </SelectItem>

                </SelectContent>

              </Select>


              <input
                type="hidden"

                {...register(
                  'propertyType',
                  {
                    required:
                      'Property type is required'
                  }
                )}

              />

            </FormFieldWrapper>



            <FormFieldWrapper

              label="Price per Night (₹)"

              required

              error={
                errors.pricePerNight
                  ?.message
              }

            >

              <Input

                type="number"

                min="1"

                placeholder="
                  E.g., 5000
                "

                className="
                  text-foreground
                "

                {...register(
                  'pricePerNight',
                  {
                    required:
                      'Price is required',

                    min: {
                      value: 1,

                      message:
                        'Price must be greater than 0'
                    }
                  }
                )}

              />

            </FormFieldWrapper>

          </div>



          {/* BEDROOMS */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-6
            "
          >

            <FormFieldWrapper

              label="Bedrooms"

              required

              error={
                errors.bedrooms?.message
              }

            >

              <Input

                type="number"

                min="1"

                className="
                  text-foreground
                "

                {...register(
                  'bedrooms',
                  {
                    required:
                      'Bedrooms are required',

                    min: {
                      value: 1,

                      message:
                        'Minimum 1 bedroom'
                    }
                  }
                )}

              />

            </FormFieldWrapper>



            <FormFieldWrapper

              label="Bathrooms"

              required

              error={
                errors.bathrooms?.message
              }

            >

              <Input

                type="number"

                min="0.5"

                step="0.5"

                className="
                  text-foreground
                "

                {...register(
                  'bathrooms',
                  {
                    required:
                      'Bathrooms are required',

                    min: {
                      value: 0.5,

                      message:
                        'Minimum 0.5 bathroom'
                    }
                  }
                )}

              />

            </FormFieldWrapper>



            <FormFieldWrapper

              label="Max Guests"

              required

              error={
                errors.guestCapacity
                  ?.message
              }

            >

              <Input

                type="number"

                min="1"

                className="
                  text-foreground
                "

                {...register(
                  'guestCapacity',
                  {
                    required:
                      'Guest capacity is required',

                    min: {
                      value: 1,

                      message:
                        'Minimum 1 guest'
                    }
                  }
                )}

              />

            </FormFieldWrapper>

          </div>



          {/* HOUSE RULES */}

          <FormFieldWrapper
            label="House Rules"
          >

            <Textarea

              placeholder="
                E.g., No smoking,
                Check-in at 2 PM...
              "

              className="
                text-foreground
              "

              {...register(
                'houseRules'
              )}

            />

          </FormFieldWrapper>



          {/* INFO */}

          <div
            className="
              text-sm
              text-muted-foreground
              bg-amber-50
              dark:bg-amber-900/20
              p-3
              rounded-lg
              border
              border-amber-200
              dark:border-amber-900/50
            "
          >

            Your property will be submitted
            for admin approval.

          </div>


        </form>

      </div>



      {/* =========================================
          FOOTER
      ========================================= */}

      <div
        className="
          p-6
          border-t
          border-border
          bg-muted/10
          flex
          justify-end
          gap-3
          mt-auto
        "
      >

        <Button

          variant="outline"

          type="button"

          onClick={onClose}

          disabled={isSubmitting}

        >

          Cancel

        </Button>



        <Button

          type="submit"

          form="property-form"

          disabled={isSubmitting}

          className="
            bg-primary
            text-primary-foreground
            hover:bg-primary/90
            font-bold
            px-6
          "
        >

          {isSubmitting ? (

            <>

              <Loader2
                className="
                  w-4
                  h-4
                  mr-2
                  animate-spin
                "
              />

              Submitting...

            </>

          ) : (

            <>

              <Save
                className="
                  w-4
                  h-4
                  mr-2
                "
              />

              Submit Property

            </>

          )}

        </Button>

      </div>

    </div>

  );

};


export default HostPropertyForm; 