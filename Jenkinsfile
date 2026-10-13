pipeline {
    agent any

    environment {
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        PUBLIC_API_URL = 'http://184.193.139.186:4000/api'
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
    }

    post {
        always {
            sh 'docker image prune -f'
        }
        success {
            echo 'Pipeline pass hui'
        }
        failure {
            echo 'Pipeline fail hui, console output dekho'
        }
    }
}
