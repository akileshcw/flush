curl -X POST http://localhost:8001/services \
  --data "name=auth-service" \
  --data "url=http://auth-service:3000"
curl -X POST http://localhost:8001/services/auth-service/routes \
  --data "name=auth-route" \
  --data "paths[]=/auth" \
  --data "strip_path=true"

# Configure patient-service
curl -X POST http://localhost:8001/services \
  --data "name=patient-service" \
  --data "url=http://patient-service:3001"
curl -X POST http://localhost:8001/services/patient-service/routes \
  --data "name=patient-route" \
  --data "paths[]=/patients" \
  --data "strip_path=true"
curl -X POST http://localhost:8001/services/patient-service/plugins \
  --data "name=jwt" \
  --data "config.key_claim_name=iss" \
  --data "config.secret_is_base64=false" \
  --data "config.claims_to_verify=exp" \
  --data "config.secret=your_jwt_secret"
curl -X POST http://localhost:8001/services/patient-service/plugins \
  --data "name=acl" \
  --data "config.hide_groups_header=true" \
  --data "config.allow=patients"

# Configure appointment-service
curl -X POST http://localhost:8001/services \
  --data "name=appointment-service" \
  --data "url=http://appointment-service:3002"
curl -X POST http://localhost:8001/services/appointment-service/routes \
  --data "name=appointment-route" \
  --data "paths[]=/appointments" \
  --data "strip_path=true"
curl -X POST http://localhost:8001/services/appointment-service/plugins \
  --data "name=jwt" \
  --data "config.key_claim_name=iss" \
  --data "config.secret_is_base64=false" \
  --data "config.claims_to_verify=exp" \
  --data "config.secret=your_jwt_secret"
curl -X POST http://localhost:8001/services/appointment-service/plugins \
  --data "name=acl" \
  --data "config.hide_groups_header=true" \
  --data "config.allow=appointments"

# Configure doctor-service
curl -X POST http://localhost:8001/services \
  --data "name=doctor-service" \
  --data "url=http://doctor-service:3003"
curl -X POST http://localhost:8001/services/doctor-service/routes \
  --data "name=doctor-route" \
  --data "paths[]=/doctors" \
  --data "strip_path=true"
curl -X POST http://localhost:8001/services/doctor-service/plugins \
  --data "name=jwt" \
  --data "config.key_claim_name=iss" \
  --data "config.secret_is_base64=false" \
  --data "config.claims_to_verify=exp" \
  --data "config.secret=your_jwt_secret"
curl -X POST http://localhost:8001/services/doctor-service/plugins \
  --data "name=acl" \
  --data "config.hide_groups_header=true" \
  --data "config.allow=doctors"

# Configure patient-portal-service
curl -X POST http://localhost:8001/services \
  --data "name=patient-portal-service" \
  --data "url=http://patient-portal-service:3004"
curl -X POST http://localhost:8001/services/patient-portal-service/routes \
  --data "name=patient-portal-route" \
  --data "paths[]=/patient-portal" \
  --data "strip_path=true"
curl -X POST http://localhost:8001/services/patient-portal-service/plugins \
  --data "name=jwt" \
  --data "config.key_claim_name=iss" \
  --data "config.secret_is_base64=false" \
  --data "config.claims_to_verify=exp" \
  --data "config.secret=your_jwt_secret"
curl -X POST http://localhost:8001/services/patient-portal-service/plugins \
  --data "name=acl" \
  --data "config.hide_groups_header=true" \
  --data "config.allow=patientPortal"

# Configure notification-service
curl -X POST http://localhost:8001/services \
  --data "name=notification-service" \
  --data "url=http://notification-service:3005"
curl -X POST http://localhost:8001/services/notification-service/routes \
  --data "name=notification-route" \
  --data "paths[]=/notifications" \
  --data "strip_path=true"
curl -X POST http://localhost:8001/services/notification-service/plugins \
  --data "name=jwt" \
  --data "config.key_claim_name=iss" \
  --data "config.secret_is_base64=false" \
  --data "config.claims_to_verify=exp" \
  --data "config.secret=your_jwt_secret"
curl -X POST http://localhost:8001/services/notification-service/plugins \
  --data "name=acl" \
  --data "config.hide_groups_header=true" \
  --data "config.allow=notifications"

echo "Kong configuration completed!"