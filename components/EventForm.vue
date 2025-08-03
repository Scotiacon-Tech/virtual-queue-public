<script setup lang="ts">
import * as yup from 'yup'
import {type PublicPathState, useForm} from 'vee-validate'
import DateField from "~/components/DateField.vue";
import TimeField from "~/components/TimeField.vue";
import dayjs, {Dayjs} from "dayjs";

type Event = {
  name: string
  startTime: string
  endTime: string
  visibleFrom?: string
};

const model = defineModel<Event | null>();

const props = defineProps<{
  submitDisabled?: boolean,
  submitText?: string
  allowReset?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', event: Event): Promise<void>;
  (e: 'reset'): void;
}>()

const isoTimeRegex = /(2[0123]:[0-5][0-9])|([01][0-9]:[0-5][0-9])/

function parseTime(val: string): [number, number] {
  const hours = parseInt(val.substring(0, 2), 10)
  const minutes = parseInt(val.substring(3, 5), 10)
  return [hours, minutes]
}

function compareDateAndTime(lDate: Date, lTime: string, rDate: Date, rTime: string): number {
  const [lHour, lMin] = parseTime(lTime)
  const [rHour, rMin] = parseTime(rTime)

  if (lDate.getFullYear() < rDate.getFullYear()) { return -1; }
  if (lDate.getFullYear() > rDate.getFullYear()) { return +1; }

  if (lDate.getMonth() < rDate.getMonth()) { return -1; }
  if (lDate.getMonth() > rDate.getMonth()) { return +1; }

  if (lDate.getDate() < rDate.getDate()) { return -1; }
  if (lDate.getDate() > rDate.getDate()) { return +1; }

  if (lHour < rHour) { return -1; }
  if (lHour > rHour) { return +1; }

  if (lMin < rMin) { return -1; }
  if (lMin > rMin) { return +1; }

  return 0;
}

const schema = yup.object({
  name: yup.string().required('Name is required').label('Name'),
  startDate: yup.date()
      .required('Start date is required')
      .label('Start Date'),
  startTime: yup.string()
      .required('Start time is required')
      .matches(isoTimeRegex)
      .label('Start Time'),
  endDate: yup.date()
      .required('End date is required')
      .min(yup.ref('startDate'), 'End Date must be before Start Date')
      .label('End Date'),
  endTime: yup.string()
      .required('End time is required')
      .matches(isoTimeRegex)
      .test(
          'is-after-start-time',
          `End time must be after Start Time`,
          function(value) {
            const startDate: Date = this.parent.startDate;
            const endDate: Date = this.parent.endDate;
            const startTime: string = this.parent.startTime;
            return compareDateAndTime(startDate, startTime, endDate, value) == -1;
          })
      .label('End Time'),
  visibility: yup.string().oneOf(['hide', 'after']).label('Visibility'),
  visibilityDate: yup.date()
      .when(
          'visibility',
          {
            is: 'after',
            then: s => s.required('Visible From Date is required')
          }
      ),
  visibilityTime: yup.string()
      .when(
          'visibility',
          {
            is: 'after',
            then: s => s.matches(isoTimeRegex).required('Visible From Time is required')
          }
      ),
})
type SchemaT = yup.InferType<typeof schema>;

const initialValues = model.value && {
  name: model.value.name,
  startDate: dayjs(model.value.startTime).startOf('day').toDate(),
  startTime: dayjs(model.value.startTime).format('HH:mm'),
  endDate: dayjs(model.value.endTime).startOf('day').toDate(),
  endTime: dayjs(model.value.endTime).format('HH:mm'),
  visibility: model.value.visibleFrom ? 'after' : 'hide',
  visibilityDate: model.value.visibleFrom ? dayjs(model.value.visibleFrom).startOf('day').toDate() : undefined,
  visibilityTime: model.value.visibleFrom ? dayjs(model.value.visibleFrom).format('HH:mm') : undefined,
} satisfies SchemaT;

const {handleSubmit, resetForm, defineField} = useForm<SchemaT>({
  validationSchema: schema,
  initialValues: initialValues
})

console.log({initialValues})

const vuetifyProps = (state: PublicPathState<any>) => ({
  'error-messages': state.errors
})

const [name, nameProps] = defineField('name', {props: vuetifyProps})
const [startDate, startDateProps] = defineField('startDate', {props: vuetifyProps})
const [startTime, startTimeProps] = defineField('startTime', {props: vuetifyProps})
const [endDate, endDateProps] = defineField('endDate', {props: vuetifyProps})
const [endTime, endTimeProps] = defineField('endTime', {props: vuetifyProps})
const [visibility, visibilityProps] = defineField('visibility', {props: vuetifyProps})
const [visibilityDate, visibilityDateProps] = defineField('visibilityDate', {props: vuetifyProps})
const [visibilityTime, visibilityTimeProps] = defineField('visibilityTime', {props: vuetifyProps})

const submit = handleSubmit(async values => {
  const [startHours, startMins] = parseTime(values.startTime)
  const [endHours, endMins] = parseTime(values.endTime)
  const start = dayjs(values.startDate).hour(startHours).minute(startMins).startOf('minutes')
  const end = dayjs(values.endDate).hour(endHours).minute(endMins).startOf('minutes')

  let visibleFrom: Dayjs | undefined
  if (values.visibility == 'after') {
    const [h, m] = parseTime(values.visibilityTime!)
    visibleFrom = dayjs(values.visibilityDate!).hour(h).minute(m).startOf('minutes')
  }

  await emit('submit', {
    name: values.name,
    startTime: start.format('YYYY-MM-DD[T]HH:mm:ssZ'),
    endTime: end.format('YYYY-MM-DD[T]HH:mm:ssZ'),
    visibleFrom: visibleFrom?.format('YYYY-MM-DD[T]HH:mm:ssZ')
  })
})

function reset() {
  resetForm()
  emit('reset')
}
</script>

<template>
<v-form @submit="submit">
  <v-text-field
      v-model="name"
      v-bind="nameProps"
      :counter="64"
      label="Name"
      class="mx-4"
  ></v-text-field>

  <v-row class="mx-3 mt-4" dense>
    <v-col>
      <VLabel>Event Starts</VLabel>
    </v-col>
  </v-row>
  <v-row class="mx-4" dense>
    <v-col class="pa-0 pr-sm-4" cols="12" sm="6">
      <DateField
          name="startDate"
          label="Start Date"
          v-model="startDate"
          v-bind="startDateProps"
      />
    </v-col>
    <v-col class="pa-0" cols="12" sm="6">
      <TimeField
          name="startTime"
          label="Start Time"
          v-model="startTime"
          v-bind="startTimeProps"
      />
    </v-col>
  </v-row>


  <v-row class="mx-3 mt-4" dense>
    <v-col>
      <VLabel>Event Ends</VLabel>
    </v-col>
  </v-row>
  <v-row class="mx-4" dense>
    <v-col class="pa-0 pr-sm-4" cols="12" sm="6">
      <DateField
          name="endDate"
          label="End Date"
          v-model="endDate"
          v-bind="endDateProps"
      />
    </v-col>
    <v-col class="pa-0" cols="12" sm="6">
      <TimeField
          name="endTime"
          label="End Time"
          v-model="endTime"
          v-bind="endTimeProps"
      />
    </v-col>
  </v-row>

  <v-row class="mt-3" dense>
    <v-col>
      <v-radio-group label="Visibility"
                     v-model="visibility"
                     v-bind="visibilityProps">
        <v-radio label="Hide for now" value="hide"></v-radio>
        <v-radio label="Show after" value="after"></v-radio>

        <v-row class="ml-10" dense>
          <v-col class="pa-0 pr-sm-4" cols="12" sm="6">
            <DateField
                name="visibilityDate"
                label="Visible From Date"
                :disabled="visibility != 'after'"
                v-model="visibilityDate"
                v-bind="visibilityDateProps"
            />
          </v-col>
          <v-col class="pa-0" cols="12" sm="6">
            <TimeField
                name="visibilityTime"
                label="Visible From Time"
                :disabled="visibility != 'after'"
                v-model="visibilityTime"
                v-bind="visibilityTimeProps"
            />
          </v-col>
        </v-row>
      </v-radio-group>
    </v-col>
  </v-row>


  <v-row align="start">
    <v-col cols="auto">
      <v-btn
          type="submit"
          :disabled="props.submitDisabled"
      >
        {{ props.submitText || "Submit" }}
      </v-btn>
    </v-col>
    <v-col v-if="props.allowReset == true" cols="auto">
      <v-btn variant="outlined" @click="reset()">
        Clear
      </v-btn>
    </v-col>
  </v-row>
</v-form>
</template>

<style scoped>

</style>