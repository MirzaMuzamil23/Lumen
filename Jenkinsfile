pipeline {
    agent any

    environment {
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        PUBLIC_API_URL = 'http://184.193.139.186:4000/api'
        APP_HOST       = 'ubuntu@184.193.139.186'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
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
