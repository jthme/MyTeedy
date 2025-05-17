pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub_credentials') // 在 Jenkins 中配置的 Docker Hub 凭证
        DOCKER_IMAGE = 'woowaf/se-woo-lab12' // 替换成你自己的仓库名
        DOCKER_TAG = "${env.BUILD_NUMBER}" // Jenkins 自动构建编号作为镜像 tag
    }

    stages {
        stage('Clean') {
            steps {
                sh 'mvn clean'
            }
        }
        stage('Compile') {
            steps {
                sh 'mvn compile'
            }
        }
        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        stage('Docker Push') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub_credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }
        stage('Run Containers') {
            steps {
                script {
                    def ports = [8082, 8083, 8084]
                    ports.each { port ->
                        def cname = "teedy-container-${port}"
                        sh "docker stop ${cname} || true"
                        sh "docker rm ${cname} || true"
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").run("--name ${cname} -d -p ${port}:8080")
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/target/site/**/*.*', fingerprint: true
            archiveArtifacts artifacts: '**/target/**/*.jar', fingerprint: true
            archiveArtifacts artifacts: '**/target/**/*.war', fingerprint: true
            junit '**/target/surefire-reports/*.xml'
        }
    }
}
