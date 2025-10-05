import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardCard } from '@/components/dashboard'
import { Award, Download, ExternalLink, Calendar, Shield } from 'lucide-react'
import type { Certificate } from '../types'

interface CertificatesProps {
  certificates: Certificate[]
  loading?: boolean
  onDownloadCertificate?: (certificateId: number) => void
  onViewCertificate?: (certificateId: number) => void
  onVerifyCertificate?: (certificateNumber: string) => void
}

export function Certificates({ 
  certificates, 
  loading = false,
  onDownloadCertificate,
  onViewCertificate,
  onVerifyCertificate
}: CertificatesProps) {
  const activeCertificates = certificates.filter(cert => !cert.revoked_at)
  const revokedCertificates = certificates.filter(cert => cert.revoked_at)

  if (loading) {
    return (
      <DashboardCard
        title="My Certificates"
        description="Your earned certificates and achievements"
        loading={true}
      >
        <div />
      </DashboardCard>
    )
  }

  if (certificates.length === 0) {
    return (
      <DashboardCard
        title="My Certificates"
        description="Your earned certificates and achievements"
      >
        <div className="text-center py-8">
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-500 mb-4">
            Complete your courses to earn certificates and showcase your achievements.
          </p>
          <Button variant="outline">View Available Courses</Button>
        </div>
      </DashboardCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Certificate Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Certificates</p>
              <p className="text-2xl font-bold">{certificates.length}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-2">
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCertificates.length}</p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Year</p>
              <p className="text-2xl font-bold">
                {certificates.filter(cert => 
                  new Date(cert.issued_at).getFullYear() === new Date().getFullYear()
                ).length}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Active Certificates */}
      {activeCertificates.length > 0 && (
        <DashboardCard
          title="Active Certificates"
          description={`${activeCertificates.length} valid certificate${activeCertificates.length !== 1 ? 's' : ''}`}
        >
          <div className="space-y-4">
            {activeCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-yellow-50 to-orange-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold text-lg">{certificate.course.title}</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Certificate #: {certificate.certificate_number}</span>
                        <span>Issued: {new Date(certificate.issued_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-500">
                        Congratulations on completing this course! This certificate validates your achievement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-xs text-gray-500">
                    Valid certificate • Blockchain verified
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVerifyCertificate?.(certificate.certificate_number)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewCertificate?.(certificate.id)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDownloadCertificate?.(certificate.id)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      {/* Revoked Certificates */}
      {revokedCertificates.length > 0 && (
        <DashboardCard
          title="Revoked Certificates"
          description={`${revokedCertificates.length} revoked certificate${revokedCertificates.length !== 1 ? 's' : ''}`}
        >
          <div className="space-y-4">
            {revokedCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="border rounded-lg p-4 bg-gray-50 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-lg text-gray-600">{certificate.course.title}</h3>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Revoked
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Certificate #: {certificate.certificate_number}</span>
                        <span>Issued: {new Date(certificate.issued_at).toLocaleDateString()}</span>
                        <span>Revoked: {new Date(certificate.revoked_at!).toLocaleDateString()}</span>
                      </div>
                      {certificate.revoked_reason && (
                        <p className="text-red-600">
                          Reason: {certificate.revoked_reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      {/* Achievement Timeline */}
      <DashboardCard
        title="Achievement Timeline"
        description="Your certification journey over time"
      >
        <div className="space-y-4">
          {certificates
            .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
            .map((certificate, index) => (
              <div key={certificate.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    certificate.revoked_at ? 'bg-red-400' : 'bg-green-400'
                  }`} />
                  {index < certificates.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 ml-1 mt-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{certificate.course.title}</p>
                    <Badge 
                      variant={certificate.revoked_at ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {certificate.revoked_at ? 'Revoked' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {certificate.revoked_at ? 'Revoked' : 'Earned'} on{' '}
                    {new Date(certificate.revoked_at || certificate.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </DashboardCard>
    </div>
  )
}