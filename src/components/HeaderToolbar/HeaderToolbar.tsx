import { FC } from 'react'

import { ApplicationClock } from '@components/ApplicationClock'

const HeaderToolbar: FC = () => (
  <div
    className="d-flex flex-shrink-0"
    id="end-topbar"
  >
    {/* begin::back-to-patient */}
    {/* the component will be portaled to this place */}
    <div
      className="d-flex align-items-center ms-3"
      id="back-to-active-medical-record-container"
    />
    {/* end::back-to-patient */}

    {/* begin::Application Time */}
    <div className="d-flex align-items-center ms-3">
      <ApplicationClock />
    </div>
    {/* end::Application TIime */}

    {/* the component will be portaled to this place */}
    <div
      className="d-flex align-items-center ms-3"
      id="past-patient-container"
    />
    {/* end::Past Patient */}
  </div>
)

export { HeaderToolbar }
