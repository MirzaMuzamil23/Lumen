pipeline {
    agent any

    environment {
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        PUBLIC_API_URL = 'http://184.193.139.186:4000/api'
        APP_HOST       = 'ubuntu@184.193.139.186'
        TRIVY_EXIT     = '0'
        SONAR_GATE     = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
            }
        }

        stage('Secrets scan (Gitleaks)') {
            steps {
                sh '''
                    docker run --rm -u "$(id -u):$(id -g)" \
                      -v "$WORKSPACE":/repo \
                      zricethezav/gitleaks:latest \
                      detect --source /repo --no-banner --redact --verbose --exit-code 1
                '''
            }
        }

        stage('Dependency and config scan (Trivy)') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$WORKSPACE":/src \
                      -v trivy-cache:/root/.cache/ \
                      aquasec/trivy:latest fs /src \
                      --scanners vuln,misconfig \
                      --severity HIGH,CRITICAL \
                      --exit-code ${TRIVY_EXIT}
                '''
            }
        }

        stage('Code analysis (SonarQube)') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm -u "$(id -u):$(id -g)" \
                          --network sonar-net \
                          -e SONAR_HOST_URL=http://sonarqube:9000 \
                          -e SONAR_TOKEN="$SONAR_TOKEN" \
                          -e SONAR_USER_HOME=/tmp/.sonar \
                          -v "$WORKSPACE":/usr/src \
                          sonarsource/sonar-scanner-cli:latest \
                          -Dsonar.projectKey=lumen \
                          -Dsonar.working.directory=/tmp/sonar-work \
                          -Dsonar.projectName=Lumen \
                          -Dsonar.sources=backend,frontend \
                          -Dsonar.exclusions=**/node_modules/**,**/.next/** \
                          -Dsonar.qualitygate.wait=${SONAR_GATE} \
                          -Dsonar.qualitygate.timeout=300
                    '''
                }
            }
        }

        stage('Build backend image') {
            steps {
                sh 'docker build -t lumen-backend:${IMAGE_TAG} ./backend'
            }
        }

        stage('Build frontend image') {
            steps {
                sh 'docker build -t lumen-frontend:${IMAGE_TAG} --build-arg NEXT_PUBLIC_API_URL=${PUBLIC_API_URL} ./frontend'
            }
        }

        stage('Image scan (Trivy)') {
            steps {
                sh '''
                    for svc in backend frontend; do
                        echo "===== Scanning lumen-$svc:${IMAGE_TAG} ====="
                        docker run --rm \
                          -v /var/run/docker.sock:/var/run/docker.sock \
                          -v trivy-cache:/root/.cache/ \
                          aquasec/trivy:latest image \
                          --severity HIGH,CRITICAL \
                          --exit-code ${TRIVY_EXIT} \
                          lumen-$svc:${IMAGE_TAG}
                    done
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        for svc in backend frontend; do
                            docker tag lumen-$svc:${IMAGE_TAG} $DOCKER_USER/lumen-$svc:${IMAGE_TAG}
                            docker tag lumen-$svc:${IMAGE_TAG} $DOCKER_USER/lumen-$svc:latest
                            docker push $DOCKER_USER/lumen-$svc:${IMAGE_TAG}
                            docker push $DOCKER_USER/lumen-$svc:latest
                        done
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to app-server') {
            steps {
                sshagent(credentials: ['app-server-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=accept-new ${APP_HOST} \
                          "cd ~/Lumen && git pull origin main \
                           && TAG=${IMAGE_TAG} docker compose pull \
                           && TAG=${IMAGE_TAG} docker compose up -d --no-build \
                           && docker compose ps"
                    '''
                }
            }
        }

        stage('Smoke test') {
            steps {
                sshagent(credentials: ['app-server-ssh']) {
                    sh '''
                        ssh ${APP_HOST} "curl -fs --retry 12 --retry-delay 5 --retry-connrefused http://localhost:4000/api/health"
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
        success {
            echo 'Pipeline pass hui, naya version live hai'
        }
        failure {
            echo 'Pipeline fail hui, console output dekho'
        }
    }
}
