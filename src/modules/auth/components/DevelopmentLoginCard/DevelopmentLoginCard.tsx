import { AuthAPI, PayloadLoginEmail } from '@api/authAPI'

import { KTCard } from '@components/KTCard'

import { useAuth } from '@modules/auth/contexts/AuthContext'

import FormUtil from '@/utils/formUtil'

import { DevelopmentLoginForm, DevelopmentLoginFormShape } from '../DevelopmentLoginForm'

const DevelopmentLoginCard = () => {
  const { setToken } = useAuth()

  const handleSubmit = async (values: DevelopmentLoginFormShape) => {
    const payload = FormUtil.parseValues<PayloadLoginEmail>(values)

    const { data } = await AuthAPI.loginEmail(payload)

    if (data) {
      setToken(data)
    }
  }

  return (
    <KTCard>
      <KTCard.Body>
        <h2 className="mb-10">Development Only</h2>
        <DevelopmentLoginForm onSubmit={handleSubmit} />
      </KTCard.Body>
    </KTCard>
  )
}

export default DevelopmentLoginCard
