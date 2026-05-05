clear; clc; close all;

%filename = 'wavepacket_evolution_barrier_measurement.gif';
%firstFrame = true;
%% =========================================================
% Physical constants (SI)
%% =========================================================
hb = 1.054571817e-34;        % J·s
m   = 9.10938356e-31;         % kg
q    = 1.602176634e-19;        % C
eps0 = 8.8541878128e-12;       % F/m

%% =========================================================
% Spatial grid (nm)
%% =========================================================
Nx = 256; Ny = 256;
Lx = 100e-9; Ly = 100e-9;            % nm

Dx = Lx/(Nx-1);
Dy = Ly/(Ny-1);

x = (0:Nx-1)*Dx;         % nm
y = (0:Ny-1)*Dy;         % nm

%% =========================================================
% Momentum grid (1/m)
%% =========================================================
dkx = 2*pi/(Lx);
dky = 2*pi/(Ly);

kx = (-Nx/2:Nx/2-1)*dkx;
ky = (-Ny/2:Ny/2-1)*dky;
[KX,KY] = meshgrid(kx,ky);

%% =========================================================
% Time grid
%% =========================================================
Dt = 0.04e-15;                     % fs
Nt = 16000;
Np = 250;

numlim=2000;        % Limit pel calcul de les trajectories  
numgrafic=20;
numgrafictrajectories=100;
stepgrafic=floor(Nt/numgrafic);
stepgrafictrajectories=floor(Nt/numgrafictrajectories);

%% =========================================================
% Barrier and measuring apparatus
%% =========================================================
lambda2 = 1e5;  % adjust strength
lambda = lambda2*(Dt/2)/(2*Dy);  % adjust strength

Qini = 155;
Qfin = 220;

Qx = double((1:Nx) >= Qini & (1:Nx) <= Qfin);
Q  = repmat(Qx,Ny,1);
Q=Q';

Qmask = false(Nx,1);
Qmask(Qini:Qfin) = true;

V = zeros(Nx, Ny);
barrier = 0.05*q;

barrierini = floor(Nx/2);
barrierfin = barrierini +2;

V(barrierini:barrierfin, [1:Ny]) = barrier;

figure(3)
surf(x,y, V.', 'EdgeColor','none')
view(45,30)
shading interp
colorbar
xlabel('x (nm)')
ylabel('y (nm)')
zlabel('V')
title('3D view of V')
saveas(3,'figure3.png')
saveas(3,'figure3.fig')


figure(1)
surf(x,y, Q.', 'EdgeColor','none')
view(45,30)
shading interp
colorbar
xlabel('x (nm)')
ylabel('y (nm)')
zlabel('Q')
title('3D view of Q ')
saveas(1,'figure2.png')
saveas(1,'figure2.fig')

%% =========================================================
% Initial wave packets
%% =========================================================

% ===== Gaussian wave packet 1=====
velox     = 0.8e5;           % velocity [m/s]
sigmax = 6.0e-9;          % spatial width [m]
xcentral    = 30.0e-9;         % initial position [m]

psix = 1/sqrt(2)*(1/(2*pi*sigmax^2))^(1/4).*exp(-(x-xcentral).^2/(4*sigmax^2)).*exp(1i*m*velox*(x-xcentral)/hb);


% ===== Gaussian wave packet 1=====
veloy     = 0.0;           % velocity [m/s]
sigmay = 6.0e-9;          % spatial width [m]
ycentral    = 2*Ly/3;         % initial position [m]

psiy = 1/sqrt(2)*(1/(2*pi*sigmay^2))^(1/4).*exp(-(y-ycentral).^2/(4*sigmay^2)).*exp(1i*m*veloy*(y-ycentral)/hb);

psi = psix(:)* psiy(:).';

% Normalize
normpsi = sqrt(trapz(y, trapz(x, abs(psi).^2, 2)));
psi = psi / normpsi;

%% =========================================================
% Split-operator propagators
%% =========================================================
Tprop = exp(-1i * (hb*(KX.^2 + KY.^2)/(2*m)) * Dt);
Vprop = exp(-1i * V * Dt/(2*hb));
Wphase = exp(-1i *(-lambda) * Q .* KY.' * Dt/(2*hb));

%% =========================================================
% Bohmian trajectories
%% =========================================================

positionx = zeros(Np,1);
positiony = zeros(Np,1);

pdf = abs(psi).^2;
pdf = pdf / sum(pdf(:));

idx = randsample(numel(pdf),Np,true,pdf(:));
[ix,iy] = ind2sub(size(pdf),idx);

positionx(:)=x(ix)';
positiony(:)=y(iy)';

%% =========================================================
% NEW: probability conservation diagnostic
%% =========================================================
P = zeros(1,numgrafic);      % total probability vs timeposition
tgrafic = zeros(1,numgrafic);      % total probability vs time

trajx = zeros(Np,numgrafictrajectories);
trajy = zeros(Np,numgrafictrajectories);

trajx(:,1) = positionx;
trajy(:,1) = positiony;

indgrafic=1;
indgrafictrajectories=1;

% --- NEW: probability density and normalization ---
rho = abs(psi).^2;
P(indgrafic) = trapz(y, trapz(x, rho, 2));
tgrafic(indgrafic)=Dt;
tgrafictrajectories(indgrafictrajectories)=Dt;
         
figure(2)
imagesc(x,y,rho.');
axis equal tight;
xlabel('x (nm)');
ylabel('y (nm)');
title(sprintf('t = %.2f fs   P = %.12f', 1*Dt/1e-15, P(indgrafic)));
colorbar;
axis([0 Lx 0 Ly])
drawnow;
saveas(2,'figure2.png')
saveas(2,'figure2.fig')

indgrafic=2;
indgrafictrajectories=2;

%% =========================================================
% Time evolution
%% =========================================================

for it = 2:Nt

    % --- Schrödinger propagation ---
    
    % --- V half step ---
    psi = Vprop .* psi;
    
    % -------------------------
    % W half step (finite differences)
    % -------------------------
    psi(Qmask,2:Ny-1) = psi(Qmask,2:Ny-1) + ...
    lambda * (psi(Qmask,3:Ny) - psi(Qmask,1:Ny-2));    
    
    % --- T full step ---
    psi_k = fftshift(fft2(psi));
    psi_k = Tprop .* psi_k;
    psi = ifft2(ifftshift(psi_k));
    
    % -------------------------
    % W half step (finite differences)
    % -------------------------
    psi(Qmask,2:Ny-1) = psi(Qmask,2:Ny-1) + ...
    lambda * (psi(Qmask,3:Ny) - psi(Qmask,1:Ny-2));    
    
    % --- V half step ---
    psi = Vprop .* psi;

    for ip=1:Np

        %%%%%%% Trajectoiry

        control=0;
        tempo_restante=Dt;

        while control==0

            indx=floor(positionx(ip)/Dx)+1;
            if (indx<3) 
               indx=3; 
            end    
            if (indx>Nx-3) 
               indx=Nx-3; 
            end
            indy=floor(positiony(ip)/Dy)+1;
            if (indy<3) 
               indy=3; 
            end    
            if (indy>Ny-3) 
               indy=Ny-3; 
            end
        
            % Calcul wave function 

            phib=psi(indx,indy);
            dphi_dx=(psi(indx+1,indy)-psi(indx-1,indy))/(2*Dx);
            dphi_dy=(psi(indx,indy+1)-psi(indx,indy-1))/(2*Dy);

            vbohmx=hb/m*imag(dphi_dx/phib);
            vbohmy=hb/m*imag(dphi_dy/phib)-lambda2*Q(indx,indy);

            if vbohmx>0
                dtx=abs(((indx+1)*Dx-positionx(ip))/vbohmx);
                if dtx<Dt/numlim 
                    dtx=abs(Dx/(vbohmx*numlim));
                end
            else
                dtx=abs((positionx(ip)-indx*Dx)/vbohmx); 
                if dtx<Dt/numlim 
                    dtx=abs(Dx/(vbohmx*numlim));
                end     
            end
            if vbohmy>0
                dty=abs(((indy+1)*Dy-positiony(ip))/vbohmy);
                if dty<Dt/numlim 
                    dty=abs(Dy/(vbohmy*numlim));
                end
            else
                dty=abs((positiony(ip)-indy*Dy)/vbohmy); 
                if dty<Dt/numlim 
                    dty=abs(Dy/(vbohmy*numlim));
                end     
            end
    
            tempo=min(Dt,min(tempo_restante,min(dtx,dty)));

            positionx(ip)=positionx(ip)+vbohmx*tempo;
            positiony(ip)=positiony(ip)+vbohmy*tempo;
    
            tempo_restante = tempo_restante - tempo;
    
            if tempo_restante < Dt/numlim
               control=1;
            end
    
        end %while control

        
    end %Nparticles

    % --- Visualization grafic---
    if mod(it,stepgrafic)==0

        % --- NEW: probability density and normalization ---
        rho = abs(psi).^2;
        P(indgrafic) = trapz(y, trapz(x, rho, 2));
        tgrafic(indgrafic)=it*Dt;
        
        figres=100+indgrafic;
        figure(figres)
        imagesc(x,y,rho.');
        axis equal tight;
        hold on;
        plot(trajx(:,indgrafictrajectories-1)',trajy(:,indgrafictrajectories-1)','r.','MarkerSize',8);
        hold off;
        xlabel('x (nm)');
        ylabel('y (nm)');
        title(sprintf('t = %.2f ps   P = %.12f', it*Dt/1e-12, P(indgrafic)));
        %colorbar;
        axis([0 Lx 0 Ly])
        if (lambda>0) 
        xline(x(Qini), 'r', 'LineWidth', 2);
        xline(x(Qfin), 'r', 'LineWidth', 2);
        end
        if (barrier>0)
        xline(x(barrierini), 'y', 'LineWidth', 2);
        xline(x(barrierfin), 'y', 'LineWidth', 2);
        end
        drawnow;
        nombre1 = ['figure' num2str(figres) '.png'];
        saveas(figres,nombre1)
        nombre2 = ['figure' num2str(figres) '.fig'];
        saveas(figres,nombre2)

        indgrafic=indgrafic+1;

        % =========================
        % CAPTURE FRAME
        % =========================
%        frame = getframe(gcf);
%        im = frame2im(frame);
%        [A,map] = rgb2ind(im,256);

        % =========================
        % WRITE GIF
        % =========================

 %   if firstFrame
 %       imwrite(A,map,filename,'gif','LoopCount',Inf,'DelayTime',0.05);
 %       firstFrame = false;
 %   else
 %       imwrite(A,map,filename,'gif','WriteMode','append','DelayTime',0.05);
 %   end
 %       indgrafic=indgrafic+1;

    end   %mod(it,stepgrafic)

    % --- Visualization grafic---
    if mod(it,stepgrafictrajectories)==0

        tgrafictrajectories(indgrafictrajectories)=it*Dt;
        
        trajx(:,indgrafictrajectories)=positionx;
        trajy(:,indgrafictrajectories)=positiony;
 
        indgrafictrajectories=indgrafictrajectories+1;

    end   %mod(it,stepgrafic)

end  % temps

%% =========================================================
% Final probability check plot
%% =========================================================
figure(5);
plot(tgrafic, P, 'LineWidth', 2);
xlabel('t (fs)');
ylabel('\int |\psi|^2 dx dy');
title('Probability conservation');
grid on;
saveas(5,'figure5.png')
saveas(5,'figure5.fig')

figure(6)
hold on
for ip=1:Np
plot3(trajy(ip,1:indgrafictrajectories-1),trajx(ip,1:indgrafictrajectories-1),tgrafictrajectories(1:indgrafictrajectories-1))   % draw the scatter plot
plot3(trajy(ip,1),trajx(ip,1),tgrafictrajectories(1),'r.','MarkerSize',8)    % draw the scatter plot
plot3(trajy(ip,indgrafictrajectories-1),trajx(ip,indgrafictrajectories-1),tgrafictrajectories(indgrafictrajectories-1),'b.','MarkerSize',8)    % draw the scatter plot
end
view(-31,14)
grid on
ylabel('Position y(m)')
xlabel('Position x(m)')
zlabel('Time (s)')
saveas(6,'figure6.png')
saveas(6,'figure6.fig')

figure(7)
imagesc(x,y,rho.');
axis equal tight;
xlabel('x (nm)');
ylabel('y (nm)');
axis([0 Lx 0 Ly])
title(sprintf('t = %.2f fs   P = %.12f', Nt*Dt/1e-15, P(indgrafic-1)));
colorbar;
drawnow;
saveas(7,'figure7.png')
saveas(7,'figure7.fig')

figure(8)
hold on
for ip=1:Np
plot(trajy(ip,1),trajx(ip,1),'r.','MarkerSize',18)    % draw the scatter plot
plot(trajy(ip,indgrafictrajectories-1),trajx(ip,indgrafictrajectories-1),'b.','MarkerSize',18)    % draw the scatter plot
end
title('intial position (red)  final position (blue)')
ylabel('Position y(m)')
xlabel('Position x(m)')
zlabel('Time (s)')
saveas(8,'figure8.png')
saveas(8,'figure8.fig')  

figure(9)
hold on
for ip=1:Np
plot(trajy(ip,1:indgrafictrajectories-1),trajx(ip,1:indgrafictrajectories-1))   % draw the scatter plot
plot(trajy(ip,1),trajx(ip,1),'r.','MarkerSize',8)    % draw the scatter plot
plot(trajy(ip,indgrafictrajectories-1),trajx(ip,indgrafictrajectories-1),'b.','MarkerSize',8)    % draw the scatter plot
end
grid on
ylabel('Position y(m)')
xlabel('Position x(m)')
